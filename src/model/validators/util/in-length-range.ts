import { container } from '../../container';
import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

interface Opts {
  successMessage?: string;
  exclusiveMin?: boolean;
  exclusiveMax?: boolean;
}

const autoTransformer = container.services.AutoTransformer;

export function inLengthRange(
  minLength: number,
  maxLength: number,
  errorMessage: string,
  opts?: Opts,
): SyncValidator<string> {
  return (value: string) => {
    const exclusiveMin = Boolean(opts?.exclusiveMin);
    const exclusiveMax = Boolean(opts?.exclusiveMax);

    value = autoTransformer.transform(value);

    const result: ValidatorResult = {
      isValid:
        passesMinLengthComparison(value, minLength, exclusiveMin) &&
        passesMaxLengthComparison(value, maxLength, exclusiveMax),
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (opts?.successMessage) {
      result.message = opts.successMessage;
    }

    return result;
  };
}

function passesMinLengthComparison(
  value: string,
  minLength: number,
  exclusiveMin: boolean,
) {
  return exclusiveMin ? value.length > minLength : value.length >= minLength;
}

function passesMaxLengthComparison(
  value: string,
  maxLength: number,
  exclusiveMax: boolean,
) {
  return exclusiveMax ? value.length < maxLength : value.length <= maxLength;
}
