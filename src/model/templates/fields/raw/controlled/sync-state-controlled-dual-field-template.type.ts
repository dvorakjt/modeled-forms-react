import { SyncDualFieldStateControlFn } from "../../../../fields/controlled/control-functions/dual-fields/sync-dual-field-state-control-fn.type";
import { DualFieldTemplate } from "../base/dual-field-template.interface";

export type SyncStateControlledDualFieldTemplate = DualFieldTemplate & {
  syncStateControlFn : SyncDualFieldStateControlFn;
  asyncStateControlFn : undefined;
  syncValueControlFn? : undefined;
  asyncValueControlFn? : undefined;
}