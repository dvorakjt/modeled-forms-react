import { AsyncAdapterFn } from "../adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../adapters/sync-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";

export type SimpleValueControlFn<Fields extends FormElementMap> = SyncAdapterFn<Fields, string> | 
AsyncAdapterFn<Fields, string>;