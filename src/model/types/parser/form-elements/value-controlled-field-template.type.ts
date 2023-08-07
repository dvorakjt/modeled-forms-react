import { AsyncAdapterFn } from "../../constituents/adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../../constituents/adapters/sync-adapter-fn.type";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";
import { BaseFieldTemplate } from "./base-field-template.type";

export type ValueControlledFieldTemplate<K extends string> = BaseFieldTemplate & {
  valueControlFn : SyncAdapterFn<TemplateDerivedFormElementMap<K>, string> | 
    AsyncAdapterFn<TemplateDerivedFormElementMap<K>, string>;
  stateControlFn : undefined;
}