import { AsyncAdapterFn } from "../adapters/async-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { DualFieldSetValueArg } from "../state/dual-field-set-value-arg.interface";

export type AsyncDualValueControlFn<Fields extends FormElementMap> = AsyncAdapterFn<Fields, DualFieldSetValueArg>;