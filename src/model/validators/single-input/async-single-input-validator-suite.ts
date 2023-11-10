import { Observable, Subscriber, Subscription, from } from 'rxjs';
import { Validity } from '../../state/validity.enum';
import { MessageType } from '../../state/messages/message-type.enum';
import type { AsyncValidator } from '../async-validator.type';
import type { SingleInputValidatorSuite } from './single-input-validator-suite.interface';
import type { ValidatorSuiteResult } from '../validator-suite-result.interface';
import type { ValidatorSuiteResultsObject } from '../validator-suite-results-object.interface';
import type { ValidatorResult } from '../validator-result.interface';
import { logErrorInDevMode } from '../../util/log-error-in-dev-mode';
import { Config } from '../../config-loader/config.interface';

type ValidatorSubscriptionMap = {
  [key: number]: Subscription;
};

export class AsyncSingleInputValidatorSuite<T>
  implements SingleInputValidatorSuite<T>
{
  readonly _validators: Array<AsyncValidator<T>>;
  readonly _pendingValidatorMessage: string;
  readonly _config : Config;
  _validatorSubscriptions: ValidatorSubscriptionMap = {};

  constructor(
    validators: Array<AsyncValidator<T>>,
    pendingValidatorMessage: string,
    config : Config
  ) {
    this._validators = validators;
    this._pendingValidatorMessage = pendingValidatorMessage;
    this._config = config;
  }

  evaluate(value: T) {
    this._unsubscribeAll();
    const result: ValidatorSuiteResultsObject<T> = {
      syncResult: {
        value,
        validity: Validity.PENDING,
        messages: [
          {
            type: MessageType.PENDING,
            text: this._pendingValidatorMessage,
          },
        ],
      },
    };
    result.observable = new Observable<ValidatorSuiteResult<T>>(subscriber => {
      const observableResult: ValidatorSuiteResult<T> = {
        value,
        validity: Validity.VALID_FINALIZABLE,
        messages: [],
      };
      for (
        let validatorId = 0;
        validatorId < this._validators.length;
        validatorId++
      ) {
        const validator = this._validators[validatorId];
        try {
          //as the validator function is user-defined, it may throw errors even before the promise rejects
          const promise = validator(value);
          const subscription = from(promise).subscribe(
            this._createValidatorObserver(
              observableResult,
              subscriber,
              validatorId,
            ),
          );
          this._validatorSubscriptions[validatorId] = subscription;
        } catch (e) {
          this._createValidatorObserverErrorMethod(
            observableResult,
            subscriber,
          )(e);
        }
      }
    });
    return result;
  }

  _createValidatorObserver(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
    validatorId: number,
  ) {
    return {
      next: this._createValidatorObserverNextMethod(
        observableResult,
        outerSubscriber,
        validatorId,
      ),
      error: this._createValidatorObserverErrorMethod(
        observableResult,
        outerSubscriber,
      ),
    };
  }

  _createValidatorObserverNextMethod(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
    validatorId: number,
  ) {
    const nextMethod = (next: ValidatorResult) => {
      const { isValid, message: messageTxt } = next;
      if (!isValid) {
        this._unsubscribeAll();
        observableResult.validity = Validity.INVALID;
        if (messageTxt) {
          observableResult.messages.push({
            type: MessageType.INVALID,
            text: messageTxt,
          });
        }
        outerSubscriber.next(observableResult);
        outerSubscriber.complete();
      } else {
        if (messageTxt) {
          observableResult.messages.push({
            type: MessageType.VALID,
            text: messageTxt,
          });
        }
        this._unsubscribeById(validatorId);
        if (this._allValidatorsCompleted()) {
          outerSubscriber.next(observableResult);
          outerSubscriber.complete();
        }
      }
    };
    return nextMethod;
  }

  _createValidatorObserverErrorMethod(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
  ) {
    const errorMethod = (e: any) => {
      this._unsubscribeAll();
      logErrorInDevMode(e);
      observableResult.validity = Validity.ERROR;
      observableResult.messages.push({
        type: MessageType.ERROR,
        text: this._config.globalMessages.singleFieldValidationError,
      });
      outerSubscriber.next(observableResult);
      outerSubscriber.complete();
    };
    return errorMethod;
  }

  _unsubscribeAll() {
    for (const key in this._validatorSubscriptions) {
      this._validatorSubscriptions[key].unsubscribe();
    }
    this._validatorSubscriptions = {};
  }

  _unsubscribeById(validatorId: number) {
    this._validatorSubscriptions[validatorId].unsubscribe();
    delete this._validatorSubscriptions[validatorId];
  }

  _allValidatorsCompleted() {
    return Object.keys(this._validatorSubscriptions).length === 0;
  }
}
