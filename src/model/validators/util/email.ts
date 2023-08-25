import { config } from '../../../config';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

export function email(
  errorMessage: string,
  successMessage?: string,
): SyncValidator<string> {
  return (value: string) => {
    if (config.autoTrim) value = value.trim();

    const result: ValidatorResult = {
      isValid: value.length > 0 && config.emailRegex.test(value)
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }

    return result;
  };
}
