import { SyncDualFieldValueControlFn } from "../../../../fields/controlled/control-functions/dual-fields/sync-dual-field-value-control-fn.type";
import { DualFieldTemplate } from "../base/dual-field-template.interface";

export type SyncValueControlledDualFieldTemplate = DualFieldTemplate & {
  syncValueControlFn : SyncDualFieldValueControlFn;
  asyncValueControlFn? : undefined;
  syncStateControlFn? : undefined;
  asyncStateControlFn? : undefined;
}