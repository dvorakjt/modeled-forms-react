import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";
import { SimpleStateControlFn } from "../../constituents/fields/simple-state-control-fn.type";
import { FieldTemplate } from "./field-template.type";

export type StateControlledFieldTemplate<K extends string> = FieldTemplate & {
  stateControlFn : SimpleStateControlFn<TemplateDerivedFormElementMap<K>>;
  valueControlFn : undefined;
}