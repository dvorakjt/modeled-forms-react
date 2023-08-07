import { AsyncAdapterFn } from "../../constituents/adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../../constituents/adapters/sync-adapter-fn.type";
import { DualFieldSetValueArg } from "../../constituents/state/dual-field-set-value-arg.interface";
import { DualFieldTemplate } from "./dual-field-template.type";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";

export type ValueControlledDualFieldTemplate<K extends string> = DualFieldTemplate & {
  valueControlFn : SyncAdapterFn<TemplateDerivedFormElementMap<K>, DualFieldSetValueArg> | 
  AsyncAdapterFn<TemplateDerivedFormElementMap<K>, DualFieldSetValueArg>;
  stateControlFn? : undefined;
}