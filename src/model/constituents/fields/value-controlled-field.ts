import { MessageType } from '../../types/constituents/state/messages/message-type.enum';
import { Validity } from '../../types/constituents/state/validity.enum';
import { GlobalMessages } from '../constants/global-messages.enum';
import type { Adapter } from '../../types/constituents/adapters/adapter.interface';
import type { Field } from '../../types/constituents/fields/field.interface';
import type { DualFieldSetStateArg } from '../../types/constituents/state/dual-field-set-state-arg.interface';
import type { DualFieldSetValueArg } from '../../types/constituents/state/dual-field-set-value-arg.interface';
import type { FieldState } from '../../types/constituents/state/field-state.interface';

export class ValueControlledField implements Field {
  protected readonly field: Field;
  protected readonly adapter: Adapter<DualFieldSetValueArg | string | undefined>;

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

  constructor(field: Field, adapter: Adapter<DualFieldSetValueArg | string | undefined>) {
    this.field = field;
    this.adapter = adapter;
    this.adapter.stream.subscribe({
      next: (next: string | DualFieldSetValueArg | undefined) => {
        if(next) this.setValue(next)
      },
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