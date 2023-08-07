import { SyncValidator } from '../../../../../../model/types/constituents/validators/sync-validator.type';

type CreateErrantSyncValidatorArg = Error | string;

export function createErrantSyncValidator<T>(
  errorOrMessage?: CreateErrantSyncValidatorArg,
) {
  return (() => {
    if (errorOrMessage instanceof Error) throw errorOrMessage;
    else throw new Error(errorOrMessage);
  }) as SyncValidator<T>;
}
