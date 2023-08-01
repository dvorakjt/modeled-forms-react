import { FormElementMap } from "../form-elements/form-element-map.type";
import { AsyncBaseFinalizerFn } from "./async-base-finalizer-fn.type";
import { AsyncFinalizerFn } from "./async-finalizer-fn.type";
import { SyncBaseFinalizerFunction } from "./sync-base-finalizer-fn.type";
import { SyncFinalizerFn } from "./sync-finalizer-fn.type";

export interface FinalizerFnFactory {
  createSyncFinalizerFn<Fields extends FormElementMap>(baseAdapterFn : SyncBaseFinalizerFunction<Fields>) : SyncFinalizerFn<Fields>;
  createAsyncFinalizerFn<Fields extends FormElementMap>(baseAdapterFn : AsyncBaseFinalizerFn<Fields>) : AsyncFinalizerFn<Fields>;
}