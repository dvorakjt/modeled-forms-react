import { DualStateControlFn } from "../../constituents/fields/dual-state-control-fn.type";
import { DualFieldTemplate } from "./dual-field-template.interface";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";

export type StateControlledDualFieldTemplate<K extends string> = DualFieldTemplate & {
  stateControlFn : DualStateControlFn<TemplateDerivedFormElementMap<K>>;
  valueControlFn? : undefined;
}