import { AsyncAdapterFn } from "../adapters/async-adapter-fn.type";
import { FormElementMap } from "../form-elements/form-element-map.type";

export type AsyncFieldValueControlFn<Fields extends FormElementMap> = AsyncAdapterFn<Fields, string | undefined>;