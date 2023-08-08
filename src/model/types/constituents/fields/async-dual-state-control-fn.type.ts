import { AsyncAdapterFn } from "../adapters/async-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { DualFieldSetStateArg } from "../state/dual-field-set-state-arg.interface";

export type AsyncDualStateControlFn<Fields extends FormElementMap> = 
  AsyncAdapterFn<Fields, DualFieldSetStateArg>;