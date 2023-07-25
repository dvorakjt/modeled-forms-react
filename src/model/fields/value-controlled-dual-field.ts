import { Adapter } from "../types/adapters/adapter.interface";
import { DualField } from "../types/fields/dual-field.interface";
import { DualFieldSetValueArg } from "../types/state/dual-field-set-value-arg.interface";
import { ValueControlledField } from "./value-controlled-field";

export class ValueControlledDualField extends ValueControlledField implements DualField {

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

  constructor(field : DualField, adapter : Adapter<DualFieldSetValueArg>) {
    super(field, adapter);
  }
}