import { SyncAdapterFn } from "../adapters/sync-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { FieldState } from "../state/field-state.interface";

export type SyncFieldStateControlFn<Fields extends FormElementMap> = SyncAdapterFn<Fields, FieldState>;