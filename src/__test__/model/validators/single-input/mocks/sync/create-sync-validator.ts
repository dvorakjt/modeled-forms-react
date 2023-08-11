import { SyncValidator } from '../../../../../../model/validators/sync-validator.type';
import { ValidatorResult } from '../../../../../../model/validators/validator-result.interface';

export function createSyncValidator<T>(isValid: boolean, message?: string) {
  const result: ValidatorResult = {
    isValid,
  };

  if (message) result.message = message;

  return (() => result) as SyncValidator<T>;
}
