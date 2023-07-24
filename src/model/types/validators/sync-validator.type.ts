import { ValidatorResult } from "./validator-result.interface";

export type SyncValidator<T> = (value : T) => ValidatorResult;