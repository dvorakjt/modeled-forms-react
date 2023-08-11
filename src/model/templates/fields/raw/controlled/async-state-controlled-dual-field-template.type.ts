import { AsyncDualFieldStateControlFn } from "../../../../fields/controlled/control-functions/dual-fields/async-dual-field-state-control-fn.type";
import { DualFieldTemplate } from "../base/dual-field-template.interface";

export type AsyncStateControlledDualFieldTemplate = DualFieldTemplate & {
  asyncStateControlFn : AsyncDualFieldStateControlFn;
  syncStateControlFn? : undefined;
  asyncValueControlFn? : undefined;
  syncValueControlFn? : undefined;
}