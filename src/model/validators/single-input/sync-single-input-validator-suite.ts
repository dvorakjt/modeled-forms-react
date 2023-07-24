import { Observable } from "rxjs";
import { SubscriptionManager } from "../../types/subscriptions/subscription-manager.interface";
import { SingleInputValidatorSuite } from "../../types/validators/single-input/single-input-validator-suite.interface";
import { SyncValidator } from "../../types/validators/sync-validator.type";
import { ValidatorSuiteResult } from "../../types/state/validator-suite-result.interface";
import { Validity } from "../../types/state/validity.enum";
import { MessageType } from "../../types/state/messages/message-type.enum";
import { ErrorMessages } from "../../constants/error-messages.enum";

export class SyncSingleInputValidatorSuite<T> implements SingleInputValidatorSuite<T> {
  #validators : Array<SyncValidator<T>>;
  #subscriptionManager : SubscriptionManager;

  constructor(validators : Array<SyncValidator<T>>, subscriptionManager : SubscriptionManager) {
    this.#validators = validators;
    this.#subscriptionManager = subscriptionManager;
  }
  evaluate(value : T) {
    return this.#subscriptionManager.registerObservable(new Observable<ValidatorSuiteResult<T>>(subscriber => {
      const result : ValidatorSuiteResult<T> = { 
        value,
        validity: Validity.VALID_FINALIZABLE,
        messages: []
      }
      try {
        for(const validator of this.#validators) {
          const { isValid, message : messageTxt } = validator(value);
          if(!isValid) result.validity = Validity.INVALID;
          if(messageTxt) {
            result.messages.push({
              type: isValid ? MessageType.VALID : MessageType.INVALID,
              text: messageTxt
            });
          }
        }
      } catch(e) {
        console.error(e);
        result.validity = Validity.ERROR;
        result.messages.push({
          type: MessageType.ERROR,
          text: ErrorMessages.VALIDATION_ERROR
        });
      }
      subscriber.next(result);
      subscriber.complete();
    }));
  }
}