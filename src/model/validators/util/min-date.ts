import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

export function minDate(
  min: Date,
  errorMessage: string,
  successMessage?: string,
): SyncValidator<string> {
  return (value: string) => {
    const millis = new Date(value).getTime();

    const result: ValidatorResult = {
      isValid: !Number.isNaN(millis) && millis >= min.getTime(),
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }

    return result;
  };
}
