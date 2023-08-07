import type { Subject } from 'rxjs';
import type { ValidatorResult } from '../../../../../../model/types/constituents/validators/validator-result.interface';

export function createTriggerablePromiseRejectingAsyncValidator(
  subject: Subject<void>,
  error: Error,
) {
  return () => {
    return new Promise<ValidatorResult>((_resolve, reject) => {
      subject.subscribe({
        complete: () => reject(error),
      });
    });
  };
}
