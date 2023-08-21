import { MessageType } from '../../state/messages/message-type.enum';
import { Validity } from '../../state/validity.enum';
import { GlobalMessages } from '../../constants/global-messages.enum';
import { AbstractField } from '../base/abstract-field';
import type { Adapter } from '../../adapters/adapter.interface';
import type { FieldState } from '../../state/field-state.interface';

export class ValueControlledField extends AbstractField {
  readonly #field: AbstractField;
  readonly #adapter: Adapter<string | undefined>;

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

  constructor(field: AbstractField, adapter: Adapter<string | undefined>) {
    super();
    this.#field = field;
    this.#adapter = adapter;
    this.#adapter.stream.subscribe({
      next: (next: string | undefined) => {
        if (next) this.setValue(next);
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
