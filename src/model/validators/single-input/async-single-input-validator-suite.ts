import { Observable, Subscriber, from } from 'rxjs';
import { Validity } from '../../types/state/validity.enum';
import { MessageType } from '../../types/state/messages/message-type.enum';
import { GlobalMessages } from '../../constants/global-messages.enum';
import type { ManagedObservableFactory } from '../../types/subscriptions/managed-observable-factory.interface';
import type { ManagedSubscriptionList } from '../../types/subscriptions/managed-subscription-list.interface';
import type { AsyncValidator } from '../../types/validators/async-validator.type';
import type { SingleInputValidatorSuite } from '../../types/validators/single-input/single-input-validator-suite.interface';
import type { ValidatorSuiteResult } from '../../types/validators/validator-suite-result.interface';
import type { ValidatorSuiteResultsObject } from '../../types/validators/validator-suite-results-object.interface';
import type { ValidatorResult } from '../../types/validators/validator-result.interface';
import { logErrorInDevMode } from '../../util/log-error-in-dev-mode';

export class AsyncSingleInputValidatorSuite<T>
  implements SingleInputValidatorSuite<T>
{
  readonly #validators: Array<AsyncValidator<T>>;
  readonly #pendingValidatorMessage: string;
  readonly #managedObservableFactory: ManagedObservableFactory;
  readonly #validatorSubscriptionList: ManagedSubscriptionList;
  #returnedValidators = 0;

  constructor(
    validators: Array<AsyncValidator<T>>,
    pendingValidatorMessage: string,
    managedObservableFactory: ManagedObservableFactory,
    validatorSubscriptionList: ManagedSubscriptionList,
  ) {
    this.#validators = validators;
    this.#pendingValidatorMessage = pendingValidatorMessage;
    this.#managedObservableFactory = managedObservableFactory;
    this.#validatorSubscriptionList = validatorSubscriptionList;
  }

  evaluate(value: T) {
    this.#validatorSubscriptionList.unsubscribeAll();
    this.#returnedValidators = 0;
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
    result.observable = this.#managedObservableFactory.createManagedObservable(
      new Observable<ValidatorSuiteResult<T>>(subscriber => {
        const observableResult: ValidatorSuiteResult<T> = {
          value,
          validity: Validity.VALID_FINALIZABLE,
          messages: [],
        };
        for (const validator of this.#validators) {
          try {
            //as the validator function is user-defined, it may throw errors even before the promise rejects
            const promise = validator(value);
            const subscription = this.#managedObservableFactory
              .createManagedObservable(from(promise))
              .subscribe(
                this.createValidatorObserver(observableResult, subscriber),
              );
            this.#validatorSubscriptionList.add(subscription);
          } catch (e) {
            this.createValidatorObserverErrorMethod(
              observableResult,
              subscriber,
            )(e);
          }
        }
      }),
    );
    return result;
  }

  private createValidatorObserver(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
  ) {
    return {
      next: this.createValidatorObserverNextMethod(
        observableResult,
        outerSubscriber,
      ),
      error: this.createValidatorObserverErrorMethod(
        observableResult,
        outerSubscriber,
      ),
      complete: this.createValidatorObserverCompleteMethod(
        observableResult,
        outerSubscriber,
      ),
    };
  }

  private createValidatorObserverNextMethod(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
  ) {
    const nextMethod = (next: ValidatorResult) => {
      const { isValid, message: messageTxt } = next;
      if (!isValid) {
        this.#validatorSubscriptionList.unsubscribeAll();
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
      }
    };
    return nextMethod;
  }

  private createValidatorObserverErrorMethod(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
  ) {
    const errorMethod = (e: any) => {
      this.#validatorSubscriptionList.unsubscribeAll();
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

  private createValidatorObserverCompleteMethod(
    observableResult: ValidatorSuiteResult<T>,
    outerSubscriber: Subscriber<ValidatorSuiteResult<T>>,
  ) {
    const completeMethod = () => {
      if (++this.#returnedValidators === this.#validators.length) {
        outerSubscriber.next(observableResult);
        outerSubscriber.complete();
      }
    };
    return completeMethod;
  }
}
