import { UserFacingMultiInputValidatedField } from "./user-facing-multi-input-validated-field";
import type { DualField } from "../../types/constituents/fields/dual-field.interface";
import type { UserFacingMultiInputValidatorReducer } from "../reducers/user-facing-multi-input-validator-reducer";
import type { DualFieldSetValueArg } from "../../types/constituents/state/dual-field-set-value-arg.interface";
import type { DualFieldSetStateArg } from "../../types/constituents/state/dual-field-set-state-arg.interface";

export class UserFacingMultiInputValidatedDualField extends UserFacingMultiInputValidatedField implements DualField {
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
    return this.baseField as DualField;
  }

  constructor(baseField : DualField, userFacingMultiInputValidityReducer : UserFacingMultiInputValidatorReducer) {
    super(baseField, userFacingMultiInputValidityReducer);
  }

  setValue(value: DualFieldSetValueArg) {
    super.setValue(value);
  }

  setState(state: DualFieldSetStateArg): void {
    super.setState(state);
  }
}