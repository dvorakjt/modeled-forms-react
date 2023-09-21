import { AbstractField } from '../../fields/base/abstract-field';
import { FinalizerFacingMultiInputValidatedFormElement } from './finalizer-facing-multi-input-validated-form-element';
import { UserFacingMultiInputValidatedDualField } from './user-facing-multi-input-validated-dual-field';
import { UserFacingMultiInputValidatedField } from './user-facing-multi-input-validated-field';
import { AbstractDualField } from '../../fields/base/abstract-dual-field';
import { AbstractNestedForm } from '../../forms/abstract-nested-form';
import { UserFacingMultiInputValidatedNestedForm } from './user-facing-multi-input-validated-nested-form';

interface MultiInputValidatedFormElementFactory {
  createUserAndFinalizerFacingMultiInputValidatedFormElement(
    baseField: AbstractField | AbstractDualField | AbstractNestedForm,
  ): [
    (
      | UserFacingMultiInputValidatedField
      | UserFacingMultiInputValidatedDualField
      | UserFacingMultiInputValidatedNestedForm
    ),
    FinalizerFacingMultiInputValidatedFormElement,
  ];
}
const MultiInputValidatedFormElementFactoryKey =
  'MultiInputValidatedFormElementFactory';
type MultiInputValidatedFormElementFactoryKeyType =
  typeof MultiInputValidatedFormElementFactoryKey;

export {
  MultiInputValidatedFormElementFactoryKey,
  type MultiInputValidatedFormElementFactory as MultiInputValidatedFormElementFactory,
  type MultiInputValidatedFormElementFactoryKeyType,
};
