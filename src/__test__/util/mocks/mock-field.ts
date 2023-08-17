import { BehaviorSubject, Subject } from "rxjs";
import { AbstractField } from "../../../model/fields/base/abstract-field";
import { FieldState } from "../../../model/state/field-state.interface";
import { State } from "../../../model/state/state.interface";
import { Validity } from "../../../model/state/validity.enum";

export class MockField extends AbstractField {
  stateChanges : Subject<FieldState>;
  #state : FieldState;
  #defaultValue : string;
  #defaultValidity : Validity;

  constructor(defaultValue : string, defaultValidity : Validity = Validity.VALID_FINALIZABLE) {
    super();
    this.#defaultValue = defaultValue;
    this.#defaultValidity = defaultValidity;
    this.#state = {
      value: defaultValue,
      validity: defaultValidity,
      messages: [],
      omit: false,
    };
    this.stateChanges = new BehaviorSubject(this.state);
  }

  setState(state: FieldState): void {
    this.#state = state;
    this.stateChanges.next(this.state);
  }
  setValue(value: string): void {
    this.setState({
      ...this.state,
      value,
    });
  }
  get state(): State<string> {
    return this.#state;
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
  reset(): void {
    this.setState({
      value: this.#defaultValue,
      validity: this.#defaultValidity,
      messages: [],
      omit: false,
    });
  }
}
