import { StateControlledField } from './state-controlled-field';
import type { Adapter } from '../../types/constituents/adapters/adapter.interface';
import type { DualField } from '../../types/constituents/fields/dual-field.interface';
import type { DualFieldSetStateArg } from '../../types/constituents/state/dual-field-set-state-arg.interface';
import type { DualFieldSetValueArg } from '../../types/constituents/state/dual-field-set-value-arg.interface';

export class StateControlledDualField
  extends StateControlledField
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

  constructor(field: DualField, adapter: Adapter<DualFieldSetStateArg>) {
    super(field, adapter);
  }

  setValue(value: DualFieldSetValueArg) {
    super.setValue(value);
  }

  setState(state: DualFieldSetStateArg): void {
    super.setState(state);
  }
}
