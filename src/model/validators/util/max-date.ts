import { container } from '../../container';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

const autoTransformer = container.services.AutoTransformer;

export function maxDate(
  max: Date,
  errorMessage: string,
  successMessage?: string,
): SyncValidator<string> {
  return (value: string) => {
    value = autoTransformer.transform(value);

    const millis = new Date(value).getTime();

    const result: ValidatorResult = {
      isValid: !Number.isNaN(millis) && millis <= max.getTime(),
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }

    return result;
  };
}
