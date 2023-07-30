import { Subject } from 'rxjs';
import { createTriggerableAsyncValidator } from './create-triggerable-async-validator';
import { createInvalidSyncValidator } from '../sync/create-invalid-sync-validator';

export function createTriggerableInvalidAsyncValidator(
  subject: Subject<void>,
  message?: string,
) {
  return createTriggerableAsyncValidator(
    subject,
    createInvalidSyncValidator(message),
  );
}
