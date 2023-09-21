import { AbstractDualField } from '../base/abstract-dual-field';
import { Validity } from '../../state/validity.enum';
import { MessageType } from '../../state/messages/message-type.enum';
import { config } from '../../../config';
import type { Adapter } from '../../adapters/adapter.interface';
import type { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import type { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import type { FieldState } from '../../state/field-state.interface';
import { Modified } from '../../state/modified-enum';

export class StateControlledDualField extends AbstractDualField {
  readonly _field: AbstractDualField;
  readonly _adapter: Adapter<DualFieldSetStateArg>;

  get stateChanges() {
    return this._field.stateChanges;
  }

  get state() {
    return this._field.state;
  }

  set omit(omit: boolean) {
    this._field.omit = omit;
  }

  get omit() {
    return this._field.omit;
  }

  get primaryField() {
    return this._dualField.primaryField;
  }

  get secondaryField() {
    return this._dualField.secondaryField;
  }

  set useSecondaryField(useSecondaryField: boolean) {
    this._dualField.useSecondaryField = useSecondaryField;
  }

  get useSecondaryField() {
    return this._dualField.useSecondaryField;
  }

  get _dualField() {
    return this._field as AbstractDualField;
  }

  constructor(
    field: AbstractDualField,
    adapter: Adapter<DualFieldSetStateArg>,
  ) {
    super();
    this._field = field;
    this._adapter = adapter;
    this._adapter.stream.subscribe({
      next: (next: DualFieldSetStateArg) => this.setState(next),
      error: () => {
        const errorState: Partial<FieldState> = {
          value: '',
          validity: Validity.ERROR,
          messages: [
            {
              type: MessageType.ERROR,
              text: config.globalMessages.adapterError,
            },
          ],
          modified : Modified.YES
        };
        const setStateArg: DualFieldSetStateArg = this._dualField
          .useSecondaryField
          ? {
              secondaryFieldState: errorState,
            }
          : {
              primaryFieldState: errorState,
            };
        this.setState(setStateArg);
      },
    });
  }

  setValue(value: DualFieldSetValueArg) {
    this._dualField.setValue(value);
  }

  setState(state: DualFieldSetStateArg): void {
    this._dualField.setState(state);
  }

  reset(): void {
    this._dualField.reset();
  }
}
