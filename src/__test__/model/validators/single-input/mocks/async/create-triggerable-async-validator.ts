import type { Subject } from 'rxjs';
import type { SyncValidator } from '../../../../../../model/types/validators/sync-validator.type';
import type { ValidatorResult } from '../../../../../../model/types/validators/validator-result.interface';

export function createTriggerableAsyncValidator<T>(
  subject: Subject<void>,
  syncValidator: SyncValidator<T>,
) {
  return (value: T) => {
    return new Promise<ValidatorResult>(resolve => {
      subject.subscribe({
        complete: () => {
          resolve(syncValidator(value));
        },
      });
    });
  };
}
