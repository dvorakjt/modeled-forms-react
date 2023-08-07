import { SyncAdapterFn } from "../adapters/sync-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { FinalizerState } from "../state/finalizer-state.interface";

export interface SyncFinalizerFn<Fields extends FormElementMap> extends SyncAdapterFn<Fields, FinalizerState> {};