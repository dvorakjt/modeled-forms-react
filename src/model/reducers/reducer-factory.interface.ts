import { FieldStateReducer } from "./field-state/field-state-reducer.interface";
import { FinalizerValidityReducer } from "./finalizer-validity/finalizer-validity-reducer.interface";
import { MultiInputValidatorValidityReducer } from "./multi-input-validator-validity/multi-input-validator-validity-reducer.interface";
import { ValidityReducer } from "./validity/validity-reducer.interface";

export interface ReducerFactory {
  createFieldStateReducer() : FieldStateReducer;
  createFinalizerValidityReducer() : FinalizerValidityReducer;
  createUserMultiInputValidatorValidityReducer() : MultiInputValidatorValidityReducer;
  createFinalizerFacingMultiInputValidatorValidityReducer() : MultiInputValidatorValidityReducer;
  createValidityReducer() : ValidityReducer;
}

export const ReducerFactoryKey = 'ReducerFactory';

export type ReducerFactoryKeyType = typeof ReducerFactoryKey;