import { config } from '../../../config';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

export function includesDigit(
  errorMessage: string,
  successMessage?: string,
): SyncValidator<string> {
  return (value: string) => {
    if (config.autoTrim) value = value.trim();

    const result: ValidatorResult = {
      isValid: /\d/.test(value)
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }

    return result;
  };
}
