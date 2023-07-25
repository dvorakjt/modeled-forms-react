import { ErrorMessages } from "../constants/error-messages.enum";
import { Adapter } from "../types/adapters/adapter.interface";
import { Field } from "../types/fields/field.interface";
import { DualFieldSetStateArg } from "../types/state/dual-field-set-state-arg.interface";
import { DualFieldSetValueArg } from "../types/state/dual-field-set-value-arg.interface";
import { FieldState } from "../types/state/field-state.interface";
import { MessageType } from "../types/state/messages/message-type.enum";
import { Validity } from "../types/state/validity.enum";

export class StateControlledField implements Field {
  protected field : Field;
  protected adapter : Adapter<DualFieldSetStateArg | FieldState>;

  get stateChanges() {
    return this.field.stateChanges;
  }

  get state() {
    return this.field.state;
  }

  set omit(omit : boolean) {
    this.field.omit = omit;
  }

  get omit() {
    return this.field.omit;
  }

  constructor(field : Field, adapter : Adapter<DualFieldSetStateArg | FieldState>) {
    this.field = field;
    this.adapter = adapter;
    this.adapter.stream.subscribe({
      next : next => this.setState(next),
      error: () => {
        this.setState({
          value : "",
          validity: Validity.ERROR,
          messages: [
            {
              type: MessageType.ERROR,
              text: ErrorMessages.FIELD_ADAPTER_ERROR
            }
          ]
        });
      }
    });
  }

  setValue(value : DualFieldSetValueArg | string) {
    this.field.setValue(value);
  }

  setState(state: DualFieldSetStateArg | FieldState): void {
    this.field.setState(state);
  }

  reset() {
    this.field.reset();
  }
}