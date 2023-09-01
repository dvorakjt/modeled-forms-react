import { container } from '../../container';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

const autoTransformer = container.services.AutoTransformer;

export function inNumRange(
  min: number,
  max: number,
  errorMessage: string,
  successMessage?: string,
): SyncValidator<string> {
  return (value: string) => {
    value = autoTransformer.transform(value);
    const numericValue = Number(value);

    const result: ValidatorResult = {
      isValid:
        !Number.isNaN(numericValue) &&
        numericValue >= min &&
        numericValue <= max,
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }

    return result;
  };
}