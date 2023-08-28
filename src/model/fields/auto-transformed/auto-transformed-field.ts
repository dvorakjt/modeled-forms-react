import { BehaviorSubject, Subject } from 'rxjs';
import { State } from '../../state/state.interface';
import { AbstractField } from '../base/abstract-field';
import { AutoTransformer } from '../../auto-transforms/auto-transformer.interface';
import { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import { FieldState } from '../../state/field-state.interface';

export class AutoTransformedField extends AbstractField {
  stateChanges: Subject<State<string>>;
  #baseField: AbstractField;
  #autoTransformer: AutoTransformer;

  get omit() {
    return this.#baseField.omit;
  }

  set omit(omit) {
    this.#baseField.omit = omit;
  }

  constructor(baseField: AbstractField, autoTransformer: AutoTransformer) {
    super();
    this.#baseField = baseField;
    this.#autoTransformer = autoTransformer;
    this.#baseField.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  get state(): State<string> {
    return {
      ...this.#baseField.state,
      value: this.#autoTransformer.transform(this.#baseField.state.value),
    };
  }

  setState(state: FieldState | DualFieldSetStateArg): void {
    this.#baseField.setState(state);
  }

  setValue(value: string | DualFieldSetValueArg): void {
    this.#baseField.setValue(value);
  }

  reset(): void {
    this.#baseField.reset();
  }
}
