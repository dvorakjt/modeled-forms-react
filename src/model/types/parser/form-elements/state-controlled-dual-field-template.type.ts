import { AsyncAdapterFn } from "../../constituents/adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../../constituents/adapters/sync-adapter-fn.type";
import { DualFieldSetStateArg } from "../../constituents/state/dual-field-set-state-arg.interface";
import { DualFieldTemplate } from "./dual-field-template.type";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";

export type StateControlledDualFieldTemplate<K extends string> = DualFieldTemplate & {
  stateControlFn : SyncAdapterFn<TemplateDerivedFormElementMap<K>, DualFieldSetStateArg> | 
  AsyncAdapterFn<TemplateDerivedFormElementMap<K>, DualFieldSetStateArg>;
  valueControlFn? : undefined;
}