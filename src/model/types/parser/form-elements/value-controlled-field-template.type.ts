import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";
import { SimpleValueControlFn } from "../../constituents/fields/simple-value-control-fn.type";
import { FieldTemplate } from "./field-template.type";

export type ValueControlledFieldTemplate<K extends string> = FieldTemplate & {
  valueControlFn : SimpleValueControlFn<TemplateDerivedFormElementMap<K>>;
  stateControlFn : undefined;
}