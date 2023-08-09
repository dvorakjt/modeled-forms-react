import { AsyncDualValueControlFn } from "../../constituents/fields/async-dual-value-control-fn.type";
import { DualFieldTemplate } from "./dual-field-template.interface";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";

export type AsyncValueControlledDualFieldTemplate<K extends string> = DualFieldTemplate & {
  asyncValueControlFn : AsyncDualValueControlFn<TemplateDerivedFormElementMap<K>>;
  syncValueControlFn? : undefined;
  asyncStateControlFn? : undefined;
  syncStateControlFn? : undefined;
}