import { AsyncAdapterFn } from "../adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../adapters/sync-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { FieldState } from "../state/field-state.interface";

export type SimpleStateControlFn<Fields extends FormElementMap> = SyncAdapterFn<Fields, FieldState> | 
AsyncAdapterFn<Fields, FieldState>;