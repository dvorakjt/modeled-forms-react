import { createSyncValidator } from './create-sync-validator';

export function createInvalidSyncValidator(message?: string) {
  return createSyncValidator(false, message);
}
