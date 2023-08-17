import { SyncFieldValueControlFn } from "../../../fields/controlled/control-functions/fields/sync-field-value-control-fn.type";
import { FieldTemplate } from "../base/field-template.type";

export type SyncValueControlledFieldTemplate = FieldTemplate & {
  syncValueControlFn : SyncFieldValueControlFn;
  asyncValueControlFn? : undefined;
  syncStateControlFn? : undefined;
  asyncStateControlFn? : undefined;
}