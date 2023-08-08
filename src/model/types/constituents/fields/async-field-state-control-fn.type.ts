import { AsyncAdapterFn } from "../adapters/async-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { FieldState } from "../state/field-state.interface";

export type AsyncFieldStateControlFn<Fields extends FormElementMap> = 
  AsyncAdapterFn<Fields, FieldState>;