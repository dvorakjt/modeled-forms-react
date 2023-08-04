import { config } from '../../model.config';
import type { SyncValidator } from "../../types/validators/sync-validator.type";
import type { ValidatorResult } from "../../types/validators/validator-result.interface";

export function minLength(minLength : number, errorMessage : string, successMessage? : string) : SyncValidator<string> {
  return (value : string) => {
    if(config.autoTrim) value = value.trim();

    const result : ValidatorResult = {
      isValid : value.length >= minLength
    }
    if(!result.isValid) {
      result.message = errorMessage
    } else if(successMessage) {
      result.message = successMessage
    }

    return result;
  }
}