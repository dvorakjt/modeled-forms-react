import { SyncAdapterFn } from "../adapters/sync-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { DualFieldSetValueArg } from "../state/dual-field-set-value-arg.interface";

export type SyncDualValueControlFn<Fields extends FormElementMap> = SyncAdapterFn<Fields, DualFieldSetValueArg>;