import { BehaviorSubject, Subject } from 'rxjs';
import { State } from '../../state/state.interface';
import { AbstractField } from '../base/abstract-field';
import { AutoTransformer } from '../../auto-transforms/auto-transformer.interface';
import { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import { FieldState } from '../../state/field-state.interface';

export class AutoTransformedField extends AbstractField {
  stateChanges: Subject<State<string>>;
  _baseField: AbstractField;
  _autoTransformer: AutoTransformer;

  get omit() {
    return this._baseField.omit;
  }

  set omit(omit) {
    this._baseField.omit = omit;
  }

  constructor(baseField: AbstractField, autoTransformer: AutoTransformer) {
    super();
    this._baseField = baseField;
    this._autoTransformer = autoTransformer;
    this._baseField.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  get state(): State<string> {
    return {
      ...this._baseField.state,
      value: this._autoTransformer.transform(this._baseField.state.value),
    };
  }

  setState(state: FieldState | DualFieldSetStateArg): void {
    this._baseField.setState(state);
  }

  setValue(value: string | DualFieldSetValueArg): void {
    this._baseField.setValue(value);
  }

  reset = () => { 
    this._baseField.reset();
  }
}
