// import { config } from '../../../model.config';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

export function maxLength(
  maxLength: number,
  errorMessage: string,
  successMessage?: string,
): SyncValidator<string> {
  return (value: string) => {
    // if (config.autoTrim) value = value.trim();

    const result: ValidatorResult = {
      isValid: value.length <= maxLength,
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }

    return result;
  };
}
