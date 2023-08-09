import { AsyncDualStateControlFn } from "../../constituents/fields/async-dual-state-control-fn.type";
import { DualFieldTemplate } from "./dual-field-template.interface";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";

export type AsyncStateControlledDualFieldTemplate<K extends string> = DualFieldTemplate & {
  asyncStateControlFn : AsyncDualStateControlFn<TemplateDerivedFormElementMap<K>>;
  syncStateControlFn? : undefined;
  asyncValueControlFn? : undefined;
  syncValueControlFn? : undefined;
}