import { UserFacingMultiInputValidatedField } from "./user-facing-multi-input-validated-field";
import { AbstractDualField } from "../base/abstract-dual-field";
import type { UserFacingMultiInputValidatorReducer } from "../../reducers/multi-input-validator-validity/user-facing-multi-input-validator-reducer";
import type { DualFieldSetValueArg } from "../../state/dual-field-set-value-arg.interface";
import type { DualFieldSetStateArg } from "../../state/dual-field-set-state-arg.interface";

export class UserFacingMultiInputValidatedDualField extends UserFacingMultiInputValidatedField implements AbstractDualField {
  get primaryField() {
    return this.baseDualField.primaryField;
  }

  get secondaryField() {
    return this.baseDualField.secondaryField;
  }

  set useSecondaryField(useSecondaryField) {
    this.baseDualField.useSecondaryField = useSecondaryField;
  }

  get useSecondaryField() {
    return this.baseDualField.useSecondaryField;
  }

  private get baseDualField() {
    return this.baseField as AbstractDualField;
  }

  constructor(baseField : AbstractDualField, userFacingMultiInputValidityReducer : UserFacingMultiInputValidatorReducer) {
    super(baseField, userFacingMultiInputValidityReducer);
  }

  setValue(value: DualFieldSetValueArg) {
    super.setValue(value);
  }

  setState(state: DualFieldSetStateArg): void {
    super.setState(state);
  }
}