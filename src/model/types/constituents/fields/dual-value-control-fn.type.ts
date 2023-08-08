import { AsyncAdapterFn } from "../adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../adapters/sync-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { DualFieldSetValueArg } from "../state/dual-field-set-value-arg.interface";

export type DualValueControlFn<Fields extends FormElementMap> = SyncAdapterFn<Fields, DualFieldSetValueArg> | 
AsyncAdapterFn<Fields, DualFieldSetValueArg>;