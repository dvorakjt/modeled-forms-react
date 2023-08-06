import { FieldStateReducer } from "./field-state-reducer.interface";
import { FinalizerValidityReducer } from "./finalizer-validity-reducer.interface";
import { MultiInputValidatorValidityReducer } from "./multi-input-validator-validity-reducer.interface";
import { ValidityReducer } from "./validity-reducer.interface";

export interface ReducerFactory {
  createFieldStateReducer() : FieldStateReducer;
  createFinalizerValidityReducer() : FinalizerValidityReducer;
  createUserMultiInputValidatorValidityReducer() : MultiInputValidatorValidityReducer;
  createFinalizerFacingMultiInputValidatorValidityReducer() : MultiInputValidatorValidityReducer;
  createValidityReducer() : ValidityReducer;
}