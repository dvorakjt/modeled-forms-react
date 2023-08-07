import { AsyncAdapterFn } from "../../constituents/adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../../constituents/adapters/sync-adapter-fn.type";
import { FieldState } from "../../constituents/state/field-state.interface";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";
import { BaseFieldTemplate } from "./base-field-template.type";

export type StateControlledFieldTemplate<K extends string> = BaseFieldTemplate & {
  stateControlFn : SyncAdapterFn<TemplateDerivedFormElementMap<K>, FieldState> | 
    AsyncAdapterFn<TemplateDerivedFormElementMap<K>, FieldState>;
  valueControlFn : undefined;
}