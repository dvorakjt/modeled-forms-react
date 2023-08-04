import { ValueControlledField } from './value-controlled-field';
import type { Adapter } from '../types/adapters/adapter.interface';
import type { DualField } from '../types/fields/dual-field.interface';
import type { DualFieldSetValueArg } from '../types/state/dual-field-set-value-arg.interface';
import type { DualFieldSetStateArg } from '../types/state/dual-field-set-state-arg.interface';

export class ValueControlledDualField
  extends ValueControlledField
  implements DualField
{
  get primaryField() {
    return this.dualField.primaryField;
  }

  get secondaryField() {
    return this.dualField.secondaryField;
  }

  set useSecondaryField(useSecondaryField: boolean) {
    this.dualField.useSecondaryField = useSecondaryField;
  }

  get useSecondaryField() {
    return this.dualField.useSecondaryField;
  }

  private get dualField() {
    return this.field as DualField;
  }

  constructor(field: DualField, adapter: Adapter<DualFieldSetValueArg | string | undefined>) {
    super(field, adapter);
  }

  setValue(value: DualFieldSetValueArg) {
    super.setValue(value);
  }

  setState(state: DualFieldSetStateArg): void {
    super.setState(state);
  }
}
