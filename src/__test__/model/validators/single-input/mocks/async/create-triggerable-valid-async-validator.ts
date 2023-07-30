import { Subject } from 'rxjs';
import { createTriggerableAsyncValidator } from './create-triggerable-async-validator';
import { createValidSyncValidator } from '../sync/create-valid-sync-validator';

export function createTriggerableValidAsyncValidator(
  subject: Subject<void>,
  message?: string,
) {
  return createTriggerableAsyncValidator(
    subject,
    createValidSyncValidator(message),
  );
}
