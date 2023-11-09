import type { SyncValidator } from '../sync-validator.type';
import type { ValidatorResult } from '../validator-result.interface';

interface Opts {
  successMessage?: string;
  exclusiveMin?: boolean;
  exclusiveMax?: boolean;
}

export function inDateRange(
  min: Date,
  max: Date,
  errorMessage: string,
  opts?: Opts,
): SyncValidator<string> {
  return (value: string) => {
    const millis = new Date(value).getTime();
    const exclusiveMin = Boolean(opts?.exclusiveMin);
    const exclusiveMax = Boolean(opts?.exclusiveMax);

    const result: ValidatorResult = {
      isValid:
        !Number.isNaN(millis) &&
        passesMinDateComparison(millis, min, exclusiveMin) &&
        passesMaxDateComparison(millis, max, exclusiveMax),
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (opts?.successMessage) {
      result.message = opts.successMessage;
    }

    return result;
  };
}

function passesMinDateComparison(
  millis: number,
  minDate: Date,
  exclusiveMin: boolean,
) {
  const minMillis = minDate.getTime();

  return exclusiveMin ? millis > minMillis : millis >= minMillis;
}

function passesMaxDateComparison(
  millis: number,
  maxDate: Date,
  exclusiveMax: boolean,
) {
  const maxMillis = maxDate.getTime();

  return exclusiveMax ? millis < maxMillis : millis <= maxMillis;
}
