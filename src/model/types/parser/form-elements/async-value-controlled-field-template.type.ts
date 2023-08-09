import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";
import { AsyncFieldValueControlFn } from "../../constituents/fields/async-field-value-control-fn.type";
import { FieldTemplate } from "./field-template.type";

export type AsyncValueControlledFieldTemplate<K extends string> = FieldTemplate & {
  asyncValueControlFn : AsyncFieldValueControlFn<TemplateDerivedFormElementMap<K>>;
  syncValueControlFn? : undefined;
  asyncStateControlFn? : undefined;
  syncStateControlFn? : undefined;
}