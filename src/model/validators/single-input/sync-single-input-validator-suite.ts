import { SingleInputValidatorSuite } from "../../types/validators/single-input/single-input-validator-suite.interface";
import { SyncValidator } from "../../types/validators/sync-validator.type";
import { ValidatorSuiteResult } from "../../types/validators/validator-suite-result.interface";
import { Validity } from "../../types/state/validity.enum";
import { MessageType } from "../../types/state/messages/message-type.enum";
import { ErrorMessages } from "../../constants/error-messages.enum";

export class SyncSingleInputValidatorSuite<T> implements SingleInputValidatorSuite<T> {
  #validators : Array<SyncValidator<T>>;

  constructor(validators : Array<SyncValidator<T>>) {
    this.#validators = validators;
  }

  evaluate(value : T) {
    return {
      syncResult : this.evaluateSync(value)
    }
  }

  private evaluateSync(value : T) {
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
      process.env.NODE_ENV === 'development' && console.error(e);
      result.validity = Validity.ERROR;
      result.messages.push({
        type: MessageType.ERROR,
        text: ErrorMessages.VALIDATION_ERROR
      });
    }
    return result;
  }
}