import { AsyncAdapter } from "../../../constituents/adapters/async-adapter";
import { SyncAdapter } from "../../../constituents/adapters/sync-adapter";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { AsyncAdapterFn } from "./async-adapter-fn.type";
import { SyncAdapterFn } from "./sync-adapter-fn.type";

export interface AdapterFactory {
  createSyncAdapterFromFnWithFields<Fields extends FormElementMap, V>(syncAdapterFn : SyncAdapterFn<Fields, V>, fields : Fields) : SyncAdapter<Fields, V>;
  createAsyncAdapterFromFnWithFields<Fields extends FormElementMap, V>(asyncAdapterFn : AsyncAdapterFn<Fields, V>, fields : Fields) : AsyncAdapter<Fields, V>;
}