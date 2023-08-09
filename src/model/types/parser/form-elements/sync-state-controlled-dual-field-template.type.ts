import { SyncDualStateControlFn } from "../../constituents/fields/sync-dual-state-control-fn.type";
import { DualFieldTemplate } from "./dual-field-template.interface";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";

export type SyncStateControlledDualFieldTemplate<K extends string> = DualFieldTemplate & {
  syncStateControlFn : SyncDualStateControlFn<TemplateDerivedFormElementMap<K>>;
  asyncStateControlFn : undefined;
  syncValueControlFn? : undefined;
  asyncValueControlFn? : undefined;
}