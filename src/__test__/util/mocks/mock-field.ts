import { BehaviorSubject, Subject } from 'rxjs';
import { AbstractField } from '../../../model/fields/base/abstract-field';
import { FieldState } from '../../../model/state/field-state.interface';
import { State } from '../../../model/state/state.interface';
import { Validity } from '../../../model/state/validity.enum';

export class MockField extends AbstractField {
  stateChanges: Subject<FieldState>;
  _state: FieldState;
  _defaultValue: string;
  _defaultValidity: Validity;

  constructor(
    defaultValue: string,
    defaultValidity: Validity = Validity.VALID_FINALIZABLE,
  ) {
    super();
    this._defaultValue = defaultValue;
    this._defaultValidity = defaultValidity;
    this._state = {
      value: defaultValue,
      validity: defaultValidity,
      messages: [],
      omit: false,
    };
    this.stateChanges = new BehaviorSubject(this.state);
  }

  setState(state: FieldState): void {
    this._state = state;
    this.stateChanges.next(this.state);
  }
  setValue(value: string): void {
    this.setState({
      ...this.state,
      value,
    });
  }
  get state(): State<string> {
    return this._state;
  }
  set omit(omit: boolean) {
    this.setState({
      ...this.state,
      omit,
    });
  }
  get omit(): boolean {
    return this.state.omit as boolean;
  }
  reset() : void {
    this.setState({
      value: this._defaultValue,
      validity: this._defaultValidity,
      messages: [],
      omit: false,
    });
  }
}
