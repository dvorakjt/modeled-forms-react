import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";
import { SyncFieldValueControlFn } from "../../constituents/fields/sync-field-value-control-fn.type";
import { FieldTemplate } from "./field-template.type";

export type SyncValueControlledFieldTemplate<K extends string> = FieldTemplate & {
  syncValueControlFn : SyncFieldValueControlFn<TemplateDerivedFormElementMap<K>>;
  asyncValueControlFn? : undefined;
  syncStateControlFn? : undefined;
  asyncStateControlFn? : undefined;
}