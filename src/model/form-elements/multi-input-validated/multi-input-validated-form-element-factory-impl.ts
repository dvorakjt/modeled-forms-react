import {
  ReducerFactory,
  ReducerFactoryKey,
} from '../../reducers/reducer-factory.interface';
import { AbstractDualField } from '../../fields/base/abstract-dual-field';
import { AbstractField } from '../../fields/base/abstract-field';
import { FinalizerFacingMultiInputValidatedFormElement } from './finalizer-facing-multi-input-validated-form-element';
import {
  MultiInputValidatedFormElementFactory,
  MultiInputValidatedFormElementFactoryKey,
  MultiInputValidatedFormElementFactoryKeyType,
} from './multi-input-validated-form-element-factory.interface';
import { UserFacingMultiInputValidatedDualField } from './user-facing-multi-input-validated-dual-field';
import { UserFacingMultiInputValidatedField } from './user-facing-multi-input-validated-field';
import { UserFacingMultiInputValidatedNestedForm } from './user-facing-multi-input-validated-nested-form';
import { AbstractNestedForm } from '../../forms/abstract-nested-form';
import { autowire } from 'undecorated-di';

class MultiInputValidatedFormElementFactoryImpl
  implements MultiInputValidatedFormElementFactory
{
  #reducerFactory: ReducerFactory;

  constructor(reducerFactory: ReducerFactory) {
    this.#reducerFactory = reducerFactory;
  }

  createUserAndFinalizerFacingMultiInputValidatedFormElement(
    baseField: AbstractField | AbstractDualField | AbstractNestedForm,
  ): [
    (
      | UserFacingMultiInputValidatedField
      | UserFacingMultiInputValidatedDualField
      | UserFacingMultiInputValidatedNestedForm
    ),
    FinalizerFacingMultiInputValidatedFormElement,
  ] {
    const userFacingReducer =
      this.#reducerFactory.createUserMultiInputValidatorValidityReducer();
    const finalizerFacingReducer =
      this.#reducerFactory.createFinalizerFacingMultiInputValidatorValidityReducer();
    const finalizerFacingFormElement =
      new FinalizerFacingMultiInputValidatedFormElement(
        baseField,
        finalizerFacingReducer,
      );

    if (baseField instanceof AbstractNestedForm) {
      const userFacingNestedForm = new UserFacingMultiInputValidatedNestedForm(
        baseField,
        userFacingReducer,
      );
      return [userFacingNestedForm, finalizerFacingFormElement];
    } else if (baseField instanceof AbstractDualField) {
      const userFacingDualField = new UserFacingMultiInputValidatedDualField(
        baseField,
        userFacingReducer,
      );
      return [userFacingDualField, finalizerFacingFormElement];
    } else {
      const userFacingField = new UserFacingMultiInputValidatedField(
        baseField,
        userFacingReducer,
      );
      return [userFacingField, finalizerFacingFormElement];
    }
  }
}

const MultiInputValidatedFormElementFactoryService = autowire<
  MultiInputValidatedFormElementFactoryKeyType,
  MultiInputValidatedFormElementFactory,
  MultiInputValidatedFormElementFactoryImpl
>(
  MultiInputValidatedFormElementFactoryImpl,
  MultiInputValidatedFormElementFactoryKey,
  [ReducerFactoryKey],
);

export {
  MultiInputValidatedFormElementFactoryImpl,
  MultiInputValidatedFormElementFactoryService,
};
