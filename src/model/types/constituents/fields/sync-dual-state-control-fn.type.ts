import { SyncAdapterFn } from "../adapters/sync-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { DualFieldSetStateArg } from "../state/dual-field-set-state-arg.interface";

export type SyncDualStateControlFn<Fields extends FormElementMap> = SyncAdapterFn<Fields, DualFieldSetStateArg>;