import { config } from '../../../config';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

export function dateInRange(
  min : Date,
  max: Date,
  errorMessage: string,
  successMessage?: string,
): SyncValidator<string> {
  return (value: string) => {
    if (config.autoTrim) value = value.trim();

    const millis = new Date(value).getTime();
 
    const result: ValidatorResult = {
      isValid: !Number.isNaN(millis) && millis >= min.getTime() && millis <= max.getTime()
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }

    return result;
  };
}
