import { SyncAdapterFn } from "../adapters/sync-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";

export type SyncFieldValueControlFn<Fields extends FormElementMap> = SyncAdapterFn<Fields, string | undefined>;