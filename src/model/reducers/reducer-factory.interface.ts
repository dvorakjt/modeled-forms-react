import { FieldStateReducer } from './field-state/field-state-reducer.interface';
import { FinalizerValidityReducer } from './finalizer-validity/finalizer-validity-reducer.interface';
import { ModificationReducer } from './modification/modification-reducer.interface';
import { MultiInputValidatorValidityReducer } from './multi-input-validator-validity/multi-input-validator-validity-reducer.interface';
import { ValidityReducer } from './validity/validity-reducer.interface';
import { VisitationReducer } from './visitation/visitation-reducer.interface';

interface ReducerFactory {
  createFieldStateReducer(): FieldStateReducer;
  createFinalizerValidityReducer(): FinalizerValidityReducer;
  createUserMultiInputValidatorValidityReducer(): MultiInputValidatorValidityReducer;
  createFinalizerFacingMultiInputValidatorValidityReducer(): MultiInputValidatorValidityReducer;
  createValidityReducer(): ValidityReducer;
  createVisitationReducer() : VisitationReducer;
  createModificationReducer() : ModificationReducer;
}
const ReducerFactoryKey = 'ReducerFactory';
type ReducerFactoryKeyType = typeof ReducerFactoryKey;

export { ReducerFactoryKey, type ReducerFactory, type ReducerFactoryKeyType };
