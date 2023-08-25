import { config } from '../../../config';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

export function numInRange(
  min: number,
  max : number,
  errorMessage: string,
  successMessage?: string,
): SyncValidator<string> {
  return (value: string) => {
    if (config.autoTrim) value = value.trim();

    const numericValue = Number(value);

    const result: ValidatorResult = {
      isValid: !Number.isNaN(numericValue) && numericValue >= min && numericValue <= max
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }

    return result;
  };
}
