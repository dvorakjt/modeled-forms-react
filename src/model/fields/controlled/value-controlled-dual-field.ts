import { AbstractDualField } from '../base/abstract-dual-field';
import type { Adapter } from '../../adapters/adapter.interface';
import type { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import type { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import { Validity } from '../../state/validity.enum';
import { MessageType } from '../../state/messages/message-type.enum';
import { config } from '../../../config';
import { FieldState } from '../../state/field-state.interface';

export class ValueControlledDualField extends AbstractDualField {
  readonly #field: AbstractDualField;
  readonly #adapter: Adapter<DualFieldSetValueArg>;

  get stateChanges() {
    return this.#field.stateChanges;
  }

  get state() {
    return this.#field.state;
  }

  set omit(omit: boolean) {
    this.#field.omit = omit;
  }

  get omit() {
    return this.#field.omit;
  }

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
    return this.#field as AbstractDualField;
  }

  constructor(
    field: AbstractDualField,
    adapter: Adapter<DualFieldSetValueArg>,
  ) {
    super();
    this.#field = field;
    this.#adapter = adapter;
    this.#adapter.stream.subscribe({
      next: (next: DualFieldSetValueArg) => {
        if (next) this.setValue(next);
      },
      error: () => {
        const errorState: FieldState = {
          value: '',
          validity: Validity.ERROR,
          messages: [
            {
              type: MessageType.ERROR,
              text: config.globalMessages.adapterError
            },
          ],
        };
        const setStateArg: DualFieldSetStateArg = this.dualField
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
    this.dualField.setValue(value);
  }

  setState(state: DualFieldSetStateArg): void {
    this.dualField.setState(state);
  }

  reset() {
    this.dualField.reset();
  }
}
