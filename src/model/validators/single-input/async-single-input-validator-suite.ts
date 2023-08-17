import { Observable, Subscriber, Subscription, from } from 'rxjs';
import { Validity } from '../../state/validity.enum';
import { MessageType } from '../../state/messages/message-type.enum';
import { GlobalMessages } from '../../constants/global-messages.enum';
import type { AsyncValidator } from '../async-validator.type';
import type { SingleInputValidatorSuite } from './single-input-validator-suite.interface';
import type { ValidatorSuiteResult } from '../validator-suite-result.interface';
import type { ValidatorSuiteResultsObject } from '../validator-suite-results-object.interface';
import type { ValidatorResult } from '../validator-result.interface';
import { logErrorInDevMode } from '../../util/log-error-in-dev-mode';

type ValidatorSubscriptionMap = {
  [key: number]: Subscription;
};

export class AsyncSingleInputValidatorSuite<T>
  implements SingleInputValidatorSuite<T>
{
  readonly #validators: Array<AsyncValidator<T>>;
  readonly #pendingValidatorMessage: string;
  #validatorSubscriptions: ValidatorSubscriptionMap = {};

  constructor(
    validators: Array<AsyncValidator<T>>,
    pendingValidatorMessage: string,
  ) {
    this.#validators = validators;
    this.#pendingValidatorMessage = pendingValidatorMessage;
  }

  evaluate(value: T) {
    this.unsubscribeAll();
    const result: ValidatorSuiteResultsObject<T> = {
      syncResult: {
        value,
        validity: Validity.PENDING,
        messages: [
          {
            type: MessageType.PENDING,
            text: this.#pendingValidatorMessage,
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
        validatorId < this.#validators.length;
        validatorId++
      ) {
        const validator = this.#validators[validatorId];
        try {
          //as the validator function is user-defined, it may throw errors even before the promise rejects
          const promise = validator(value);
          const subscription = from(promise).subscribe(
            this.createValidatorObserver(
              observableResult,
              subscriber,
              validatorId,
            ),
          );
          this.#validatorSubscriptions[validatorId] = subscription;
        } catch (e) {
          this.createValidatorObserverErrorMethod(
            observableResult,
            subscriber,
          )(e);
        }
      }
    });
    return result;
  }

  private createValidatorObserver(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
    validatorId: number,
  ) {
    return {
      next: this.createValidatorObserverNextMethod(
        observableResult,
        outerSubscriber,
        validatorId,
      ),
      error: this.createValidatorObserverErrorMethod(
        observableResult,
        outerSubscriber,
      ),
    };
  }

  private createValidatorObserverNextMethod(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
    validatorId: number,
  ) {
    const nextMethod = (next: ValidatorResult) => {
      const { isValid, message: messageTxt } = next;
      if (!isValid) {
        this.unsubscribeAll();
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
        this.unsubscribeById(validatorId);
        if (this.allValidatorsCompleted()) {
          outerSubscriber.next(observableResult);
          outerSubscriber.complete();
        }
      }
    };
    return nextMethod;
  }

  private createValidatorObserverErrorMethod(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
  ) {
    const errorMethod = (e: any) => {
      this.unsubscribeAll();
      logErrorInDevMode(e);
      observableResult.validity = Validity.ERROR;
      observableResult.messages.push({
        type: MessageType.ERROR,
        text: GlobalMessages.SINGLE_INPUT_VALIDATION_ERROR,
      });
      outerSubscriber.next(observableResult);
      outerSubscriber.complete();
    };
    return errorMethod;
  }

  private unsubscribeAll() {
    for (const key in this.#validatorSubscriptions) {
      this.#validatorSubscriptions[key].unsubscribe();
    }
    this.#validatorSubscriptions = {};
  }

  private unsubscribeById(validatorId: number) {
    this.#validatorSubscriptions[validatorId].unsubscribe();
    delete this.#validatorSubscriptions[validatorId];
  }

  private allValidatorsCompleted() {
    return Object.keys(this.#validatorSubscriptions).length === 0;
  }
}
