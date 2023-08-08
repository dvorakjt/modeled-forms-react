import { SyncDualValueControlFn } from "../../constituents/fields/sync-dual-value-control-fn.type";
import { DualFieldTemplate } from "./dual-field-template.interface";
import { TemplateDerivedFormElementMap } from "./template-derived-form-element-map.type";

export type SyncValueControlledDualFieldTemplate<K extends string> = DualFieldTemplate & {
  syncValueControlFn : SyncDualValueControlFn<TemplateDerivedFormElementMap<K>>;
  asyncValueControlFn? : undefined;
  syncStateControlFn? : undefined;
  asyncStateControlFn? : undefined;
}