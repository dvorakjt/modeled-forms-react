import { MessageType } from '../types/state/messages/message-type.enum';
import { Validity } from '../types/state/validity.enum';
import { GlobalMessages } from '../constants/global-messages.enum';
import type { Adapter } from '../types/adapters/adapter.interface';
import type { Field } from '../types/fields/field.interface';
import type { DualFieldSetStateArg } from '../types/state/dual-field-set-state-arg.interface';
import type { DualFieldSetValueArg } from '../types/state/dual-field-set-value-arg.interface';
import type { FieldState } from '../types/state/field-state.interface';

export class StateControlledField implements Field {
  protected readonly field: Field;
  protected readonly adapter: Adapter<DualFieldSetStateArg | FieldState>;

  get stateChanges() {
    return this.field.stateChanges;
  }

  get state() {
    return this.field.state;
  }

  set omit(omit: boolean) {
    this.field.omit = omit;
  }

  get omit() {
    return this.field.omit;
  }

  constructor(
    field: Field,
    adapter: Adapter<DualFieldSetStateArg | FieldState>,
  ) {
    this.field = field;
    this.adapter = adapter;
    this.adapter.stream.subscribe({
      next: (next: DualFieldSetStateArg | FieldState) => this.setState(next),
      error: () => {
        this.setState({
          value: '',
          validity: Validity.ERROR,
          messages: [
            {
              type: MessageType.ERROR,
              text: GlobalMessages.FIELD_ADAPTER_ERROR,
            },
          ],
        });
      },
    });
  }

  setValue(value: DualFieldSetValueArg | string) {
    this.field.setValue(value);
  }

  setState(state: DualFieldSetStateArg | FieldState): void {
    this.field.setState(state);
  }

  reset() {
    this.field.reset();
  }
}
