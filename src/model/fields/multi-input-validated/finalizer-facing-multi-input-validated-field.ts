import { AbstractMultiInputValidatedField } from './abstract-multi-input-validated-field';
import { Field } from '../base/field.interface';
import { FinalizerFacingMultiInputValidatorReducer } from '../../reducers/multi-input-validator-validity/finalizer-facing-multi-input-validator-reducer';

export class FinalizerFacingMultiInputValidatedField extends AbstractMultiInputValidatedField {
  constructor(
    baseField: Field,
    finalizerFacingMultiInputValidityReducer: FinalizerFacingMultiInputValidatorReducer,
  ) {
    super(baseField, finalizerFacingMultiInputValidityReducer);
  }
}
