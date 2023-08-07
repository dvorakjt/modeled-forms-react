import { AsyncAdapterFn } from "../adapters/async-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { FinalizerState } from "../state/finalizer-state.interface";

export interface AsyncFinalizerFn<Fields extends FormElementMap> extends AsyncAdapterFn<Fields, FinalizerState> {}