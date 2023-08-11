import { AsyncAdapter } from "./async-adapter";
import { SyncAdapter } from "./sync-adapter";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { AsyncAdapterFn } from "./async-adapter-fn.type";
import { SyncAdapterFn } from "./sync-adapter-fn.type";

export interface AdapterFactory {
  createSyncAdapterFromFnWithFields<V>(syncAdapterFn : SyncAdapterFn<V>, fields : FormElementMap) : SyncAdapter<V>;
  createAsyncAdapterFromFnWithFields<V>(asyncAdapterFn : AsyncAdapterFn<V>, fields : FormElementMap) : AsyncAdapter<V>;
}