import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";
import { AsyncFieldStateControlFn } from "../../constituents/fields/async-field-state-control-fn.type";
import { FieldTemplate } from "./field-template.type";

export type AsyncStateControlledFieldTemplate<K extends string> = FieldTemplate & {
  asyncStateControlFn : AsyncFieldStateControlFn<TemplateDerivedFormElementMap<K>>;
  syncStateControlFn? : undefined;
  asyncValueControlFn? : undefined;
  syncValueControlFn : undefined;
}