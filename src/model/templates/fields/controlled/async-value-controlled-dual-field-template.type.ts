import { AsyncDualFieldValueControlFn } from "../../../fields/controlled/control-functions/dual-fields/async-dual-field-value-control-fn.type";
import { DualFieldTemplate } from "../base/dual-field-template.interface";

export type AsyncValueControlledDualFieldTemplate = DualFieldTemplate & {
  asyncValueControlFn : AsyncDualFieldValueControlFn;
  syncValueControlFn? : undefined;
  asyncStateControlFn? : undefined;
  syncStateControlFn? : undefined;
}