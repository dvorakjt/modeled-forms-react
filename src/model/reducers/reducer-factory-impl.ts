import { FieldStateReducer } from "../types/reducers/field-state-reducer.interface";
import { FinalizerValidityReducer } from "../types/reducers/finalizer-validity-reducer.interface";
import { MultiInputValidatorValidityReducer } from "../types/reducers/multi-input-validator-validity-reducer.interface";
import { ReducerFactory } from "../types/reducers/reducer-factory.interface";
import { ValidityReducer } from "../types/reducers/validity-reducer.interface";
import { FieldStateReducerImpl } from "./field-state-reducer-impl";
import { FinalizerFacingMultiInputValidatorReducer } from "./finalizer-facing-multi-input-validator-reducer";
import { FinalizerValidityReducerImpl } from "./finalizer-validity-reducer-impl";
import { UserFacingMultiInputValidatorReducer } from "./user-facing-multi-input-validator-reducer";
import { ValidityReducerImpl } from "./validity-reducer-impl";

export class ReducerFactoryImpl implements ReducerFactory {
  createFieldStateReducer(): FieldStateReducer {
    return new FieldStateReducerImpl(this.createValidityReducer());
  }
  createFinalizerValidityReducer(): FinalizerValidityReducer {
    return new FinalizerValidityReducerImpl();
  }
  createUserMultiInputValidatorValidityReducer(): MultiInputValidatorValidityReducer {
    return new UserFacingMultiInputValidatorReducer(this.createValidityReducer());
  }
  createFinalizerFacingMultiInputValidatorValidityReducer(): MultiInputValidatorValidityReducer {
    throw new FinalizerFacingMultiInputValidatorReducer(this.createValidityReducer());
  }
  createValidityReducer(): ValidityReducer {
    return new ValidityReducerImpl();
  }
}