import { MessageType } from '../../state/messages/message-type.enum';
import { Validity } from '../../state/validity.enum';
import { AbstractField } from '../base/abstract-field';
import type { Adapter } from '../../adapters/adapter.interface';
import type { FieldState } from '../../state/field-state.interface';
import { Modified } from '../../state/modified-enum';
import { Config } from '../../config-loader/config.interface';

export class ValueControlledField extends AbstractField {
  readonly _field: AbstractField;
  readonly _adapter: Adapter<string | undefined>;

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

  constructor(field: AbstractField, adapter: Adapter<string | undefined>, config : Config) {
    super();
    this._field = field;
    this._adapter = adapter;
    this._adapter.stream.subscribe({
      next: (next: string | undefined) => {
        if (next != undefined) this.setValue(next);
      },
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
          modified : Modified.YES
        });
      },
    });
  }

  setValue(value: string) {
    this._field.setValue(value);
  }

  setState(state: Partial<FieldState>): void {
    this._field.setState(state);
  }

  reset() {
    this._field.reset();
  }
}
