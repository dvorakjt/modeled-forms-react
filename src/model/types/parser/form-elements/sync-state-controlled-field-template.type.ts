import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";
import { SyncFieldStateControlFn } from "../../constituents/fields/sync-field-state-control-fn.type";
import { FieldTemplate } from "./field-template.type";

export type SyncStateControlledFieldTemplate<K extends string> = FieldTemplate & {
  syncStateControlFn : SyncFieldStateControlFn<TemplateDerivedFormElementMap<K>>;
  asyncStateControlFn? : undefined;
  syncValueControlFn? : undefined;
  asyncValueControlFn? : undefined;
}