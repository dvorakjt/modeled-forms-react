import { SyncAdapterFn } from "../adapters/sync-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";

export type SyncBaseFinalizerFunction<Fields extends FormElementMap> = SyncAdapterFn<Fields, any>;