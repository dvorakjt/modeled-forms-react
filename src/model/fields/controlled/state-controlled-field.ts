import { MessageType } from '../../state/messages/message-type.enum';
import { Validity } from '../../state/validity.enum';
import { config } from '../../../config';
import { AbstractField } from '../base/abstract-field';
import type { Adapter } from '../../adapters/adapter.interface';
import type { FieldState } from '../../state/field-state.interface';

export class StateControlledField extends AbstractField {
  readonly #field: AbstractField;
  readonly #adapter: Adapter<FieldState>;

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

  constructor(field: AbstractField, adapter: Adapter<FieldState>) {
    super();
    this.#field = field;
    this.#adapter = adapter;
    this.#adapter.stream.subscribe({
      next: (next: FieldState) => this.setState(next),
      error: () => {
        this.setState({
          value: '',
          validity: Validity.ERROR,
          messages: [
            {
              type: MessageType.ERROR,
              text: config.globalMessages.adapterError,
            },
          ],
        });
      },
    });
  }

  setValue(value: string) {
    this.#field.setValue(value);
  }

  setState(state: FieldState): void {
    this.#field.setState(state);
  }

  reset() {
    this.#field.reset();
  }
}
