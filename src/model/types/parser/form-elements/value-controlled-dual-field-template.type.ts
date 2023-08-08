import { DualValueControlFn } from "../../constituents/fields/dual-value-control-fn.type";
import { DualFieldTemplate } from "./dual-field-template.interface";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";

export type ValueControlledDualFieldTemplate<K extends string> = DualFieldTemplate & {
  valueControlFn : DualValueControlFn<TemplateDerivedFormElementMap<K>>;
  stateControlFn? : undefined;
}