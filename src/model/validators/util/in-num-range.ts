import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

interface Opts {
  successMessage?: string;
  exclusiveMin?: boolean;
  exclusiveMax?: boolean;
}

export function inNumRange(
  min: number,
  max: number,
  errorMessage: string,
  opts?: Opts,
): SyncValidator<string> {
  return (value: string) => {
    const numericValue = Number(value);

    const exclusiveMin = Boolean(opts?.exclusiveMin);
    const exclusiveMax = Boolean(opts?.exclusiveMax);

    const result: ValidatorResult = {
      isValid:
        !Number.isNaN(numericValue) &&
        passesMinComparison(numericValue, min, exclusiveMin) &&
        passesMaxComparison(numericValue, max, exclusiveMax),
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (opts?.successMessage) {
      result.message = opts.successMessage;
    }

    return result;
  };
}

function passesMinComparison(num: number, min: number, exclusiveMin: boolean) {
  return exclusiveMin ? num > min : num >= min;
}

function passesMaxComparison(num: number, max: number, exclusiveMax: boolean) {
  return exclusiveMax ? num < max : num <= max;
}
