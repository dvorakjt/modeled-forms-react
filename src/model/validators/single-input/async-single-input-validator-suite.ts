import { List } from "linked-list";
import { SubscriptionManager } from "../../types/subscriptions/subscription-manager.interface";
import { AsyncValidator } from "../../types/validators/async-validator.type";
import { SingleInputValidatorSuite } from "../../types/validators/single-input/single-input-validator-suite.interface";
import { SubscriptionListItem } from "../../subscriptions/subscription-list-item";
import { Observable, from } from "rxjs";
import { Validity } from "../../types/state/validity.enum";
import { MessageType } from "../../types/state/messages/message-type.enum";
import type { ValidatorSuiteResult } from "../../types/validators/validator-suite-result.interface";
import { ErrorMessages } from "../../constants/error-messages.enum";
import { ValidatorSuiteResultsObject } from "../../types/validators/validator-suite-results-object.interface";

export class AsyncSingleInputValidatorSuite<T> implements SingleInputValidatorSuite<T> {
  #validators : Array<AsyncValidator<T>>;
  #pendingValidatorMessage : string;
  #subscriptionManager : SubscriptionManager;
  #validatorSubscriptionList = new List<SubscriptionListItem>();
  
  constructor(
    validators : Array<AsyncValidator<T>>,
    pendingValidatorMessage : string,
    subscriptionManager : SubscriptionManager
  ) {
    this.#validators = validators;
    this.#pendingValidatorMessage = pendingValidatorMessage;
    this.#subscriptionManager = subscriptionManager;
  }

  evaluate(value : T) {
    this.unsubscribeAll()
    const result : ValidatorSuiteResultsObject<T> = {
      syncResult : {
        value,
        validity: Validity.PENDING,
        messages: [
        {
          type: MessageType.PENDING,
          text: this.#pendingValidatorMessage
        }
      ]
      }
    }
    result.observable = this.#subscriptionManager.registerObservable(new Observable<ValidatorSuiteResult<T>>(subscriber => {
      const result : ValidatorSuiteResult<T> = {
        value,
        validity: Validity.VALID_FINALIZABLE,
        messages: []
      }
      for(const validator of this.#validators) {
        const validatorSubscriptionListItem = new SubscriptionListItem();
        this.#validatorSubscriptionList.append(validatorSubscriptionListItem);
        validatorSubscriptionListItem.subscription = 
          this.#subscriptionManager.registerObservable(from(validator(value))).subscribe({
            next: next => {
              validatorSubscriptionListItem.detach();
              const { isValid, message : messageTxt } = next;
              if(!isValid) {
                this.unsubscribeAll();
                result.validity = Validity.INVALID;
                if(messageTxt) {
                  result.messages.push({
                    type: MessageType.INVALID,
                    text: messageTxt
                  });
                }
                subscriber.next(result);
                subscriber.complete();
              } else {
                if(messageTxt) {
                  result.messages.push({
                    type: MessageType.VALID,
                    text: messageTxt
                  });
                }
                if(this.#validatorSubscriptionList.size === 0) {
                  this.unsubscribeAll();
                  subscriber.next(result);
                  subscriber.complete();
                }
              }
            },
            error: e => {
              this.unsubscribeAll();
              process.env.NODE_ENV === 'development' && console.error(e);
              result.validity = Validity.ERROR;
              result.messages.push({
                type : MessageType.ERROR,
                text : ErrorMessages.VALIDATION_ERROR
              });
            }
          });
      }
    }));
    return result;
  }

  private unsubscribeAll() {
    let subscriptionListItem = this.#validatorSubscriptionList.head;
    while(subscriptionListItem !== null) {
      subscriptionListItem.subscription && subscriptionListItem.subscription.unsubscribe();
      subscriptionListItem.detach();
      subscriptionListItem = this.#validatorSubscriptionList.head;
    }
  }
}