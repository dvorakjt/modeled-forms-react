import { BehaviorSubject, Subject } from 'rxjs';
import { AbstractField } from '../../fields/base/abstract-field';
import type { MultiInputValidatorValidityReducer } from '../../reducers/multi-input-validator-validity/multi-input-validator-validity-reducer.interface';
import { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import { FieldState } from '../../state/field-state.interface';
import { State } from '../../state/state.interface';
import { copyObject } from '../../util/copy-object';
import { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';

export class UserFacingMultiInputValidatedField extends AbstractField {
  readonly _baseField: AbstractField;
  readonly _multiInputValidatorReducer: MultiInputValidatorValidityReducer;
  stateChanges: Subject<State<string>>;

  get state(): FieldState {
    return {
      ...copyObject(this._baseField.state),
      validity: this._calculateValidity(),
    };
  }
  
  get omit() {
    return this._baseField.omit;
  }

  set omit(omit: boolean) {
    this._baseField.omit = omit;
  }

  constructor(
    baseField: AbstractField,
    userFacingMultiInputValidityReducer: MultiInputValidatorValidityReducer,
  ) {
    super();
    this._baseField = baseField;
    this._multiInputValidatorReducer = userFacingMultiInputValidityReducer;
    this._multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  setState(state: FieldState | DualFieldSetStateArg): void {
    this._baseField.setState(state);
  }
  setValue(value: string | DualFieldSetValueArg): void {
    this._baseField.setValue(value);
  }
  reset(): void {
    this._baseField.reset();
  }

  addValidator(validator: MultiInputValidator): void {
    this._multiInputValidatorReducer.addValidator(validator);
  }

  _calculateValidity() {
    return Math.min(
      this._baseField.state.validity,
      this._multiInputValidatorReducer.validity,
    );
  }
}
