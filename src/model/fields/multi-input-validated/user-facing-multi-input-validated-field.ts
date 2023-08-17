import { AbstractMultiInputValidatedField } from './abstract-multi-input-validated-field';
import type { UserFacingMultiInputValidatorReducer } from '../../reducers/multi-input-validator-validity/user-facing-multi-input-validator-reducer';
import type { Field } from '../base/field.interface';

export class UserFacingMultiInputValidatedField extends AbstractMultiInputValidatedField {
  constructor(
    baseField: Field,
    userFacingMultiInputValidityReducer: UserFacingMultiInputValidatorReducer,
  ) {
    super(baseField, userFacingMultiInputValidityReducer);
  }
}
