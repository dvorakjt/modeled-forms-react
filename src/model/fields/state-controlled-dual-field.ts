import { Adapter } from "../types/adapters/adapter.interface";
import { DualField } from "../types/fields/dual-field.interface";
import { DualFieldSetStateArg } from "../types/state/dual-field-set-state-arg.interface";
import { StateControlledField } from "./state-controlled-field";

export class StateControlledDualField extends StateControlledField implements DualField {

  get primaryField() {
    return this.dualField.primaryField;
  }

  get secondaryField() {
    return this.dualField.secondaryField;
  }

  set useSecondaryField(useSecondaryField : boolean) {
    this.dualField.useSecondaryField = useSecondaryField;
  }

  get useSecondaryField() {
    return this.dualField.useSecondaryField;
  }

  private get dualField() {
    return this.field as DualField;
  }

  constructor(field : DualField, adapter : Adapter<DualFieldSetStateArg>) {
    super(field, adapter);
  }
}