import { AsyncBaseFinalizerFn } from "./async-base-finalizer-fn.type";
import { AsyncFinalizerFn } from "./async-finalizer-fn.type";
import { SyncBaseFinalizerFunction } from "./sync-base-finalizer-fn.type";
import { SyncFinalizerFn } from "./sync-finalizer-fn.type";

export interface FinalizerFnFactory {
  createSyncFinalizerFn(baseAdapterFn : SyncBaseFinalizerFunction) : SyncFinalizerFn;
  createAsyncFinalizerFn(baseAdapterFn : AsyncBaseFinalizerFn) : AsyncFinalizerFn;
}