import { SyncBaseFinalizerFn } from '../../finalizers/finalizer-functions/sync-base-finalizer-fn.type';

export type SyncFinalizerTemplate = {
  syncFinalizerFn: SyncBaseFinalizerFn;
  asyncFinalizerFn?: undefined;
  preserveOriginalFields?: boolean;
};
