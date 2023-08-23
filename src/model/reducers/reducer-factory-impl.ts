import { FieldStateReducer } from './field-state/field-state-reducer.interface';
import { FinalizerValidityReducer } from './finalizer-validity/finalizer-validity-reducer.interface';
import { MultiInputValidatorValidityReducer } from './multi-input-validator-validity/multi-input-validator-validity-reducer.interface';
import {
  ReducerFactory,
  ReducerFactoryKey,
  ReducerFactoryKeyType,
} from './reducer-factory.interface';
import { ValidityReducer } from './validity/validity-reducer.interface';
import { FieldStateReducerImpl } from './field-state/field-state-reducer-impl';
import { FinalizerFacingMultiInputValidatorReducer } from './multi-input-validator-validity/finalizer-facing-multi-input-validator-reducer';
import { FinalizerValidityReducerImpl } from './finalizer-validity/finalizer-validity-reducer-impl';
import { UserFacingMultiInputValidatorReducer } from './multi-input-validator-validity/user-facing-multi-input-validator-reducer';
import { ValidityReducerImpl } from './validity/validity-reducer-impl';
import { autowire } from 'undecorated-di';

class ReducerFactoryImpl implements ReducerFactory {
  createFieldStateReducer(): FieldStateReducer {
    return new FieldStateReducerImpl(this.createValidityReducer());
  }
  createFinalizerValidityReducer(): FinalizerValidityReducer {
    return new FinalizerValidityReducerImpl();
  }
  createUserMultiInputValidatorValidityReducer(): MultiInputValidatorValidityReducer {
    return new UserFacingMultiInputValidatorReducer(
      this.createValidityReducer(),
    );
  }
  createFinalizerFacingMultiInputValidatorValidityReducer(): MultiInputValidatorValidityReducer {
    return new FinalizerFacingMultiInputValidatorReducer(
      this.createValidityReducer(),
    );
  }
  createValidityReducer(): ValidityReducer {
    return new ValidityReducerImpl();
  }
}

const ReducerFactoryService = autowire<
  ReducerFactoryKeyType,
  ReducerFactory,
  ReducerFactoryImpl
>(ReducerFactoryImpl, ReducerFactoryKey);

export { ReducerFactoryImpl, ReducerFactoryService };
