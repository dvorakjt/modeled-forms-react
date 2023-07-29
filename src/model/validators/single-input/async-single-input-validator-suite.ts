import { Observable, from } from 'rxjs';
import { Validity } from '../../types/state/validity.enum';
import { MessageType } from '../../types/state/messages/message-type.enum';
import { ErrorMessages } from '../../constants/error-messages.enum';
import type { ManagedObservableFactory } from '../../types/subscriptions/managed-observable-factory.interface';
import type { ManagedSubscriptionList } from '../../types/subscriptions/managed-subscription-list.interface';
import type { AsyncValidator } from '../../types/validators/async-validator.type';
import type { SingleInputValidatorSuite } from '../../types/validators/single-input/single-input-validator-suite.interface';
import type { ValidatorSuiteResult } from '../../types/validators/validator-suite-result.interface';
import type { ValidatorSuiteResultsObject } from '../../types/validators/validator-suite-results-object.interface';

export class AsyncSingleInputValidatorSuite<T>
  implements SingleInputValidatorSuite<T>
{
  readonly #validators: Array<AsyncValidator<T>>;
  readonly #pendingValidatorMessage: string;
  readonly #managedObservableFactory: ManagedObservableFactory;
  readonly #validatorSubscriptionList: ManagedSubscriptionList;

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
        let returnedValidators = 0;
        for (const validator of this.#validators) {
          const subscription = this.#managedObservableFactory
            .createManagedObservable(from(validator(value)))
            .subscribe({
              next: next => {
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
                  subscriber.next(observableResult);
                  subscriber.complete();
                } else {
                  if (messageTxt) {
                    observableResult.messages.push({
                      type: MessageType.VALID,
                      text: messageTxt,
                    });
                  }
                }
              },
              error: e => {
                this.#validatorSubscriptionList.unsubscribeAll();
                process.env.NODE_ENV === 'development' && console.error(e);
                observableResult.validity = Validity.ERROR;
                observableResult.messages.push({
                  type: MessageType.ERROR,
                  text: ErrorMessages.VALIDATION_ERROR,
                });
              },
              complete: () => {
                if (++returnedValidators === this.#validators.length) {
                  subscriber.next(observableResult);
                  subscriber.complete();
                }
              },
            });
          this.#validatorSubscriptionList.add(subscription);
        }
      }),
    );
    return result;
  }
}
