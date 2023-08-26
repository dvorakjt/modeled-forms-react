import { container } from '../../container';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

const autoTransformer = container.services.AutoTransformer;

export function minLength(
  minLength: number,
  errorMessage: string,
  successMessage?: string,
): SyncValidator<string> {
  return (value: string) => {
    value = autoTransformer.transform(value);

    const result: ValidatorResult = {
      isValid: value.length >= minLength,
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }

    return result;
  };
}
