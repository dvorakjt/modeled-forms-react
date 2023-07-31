import { createSyncValidator } from './create-sync-validator';

export function createValidSyncValidator(message?: string) {
  return createSyncValidator(true, message);
}
