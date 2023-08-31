import { BehaviorSubject, type Subject } from 'rxjs';
import { AbstractField } from './abstract-field';
import { AbstractDualField } from './abstract-dual-field';
import type { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import type { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import type { FieldState } from '../../state/field-state.interface';

export class DualField extends AbstractDualField {
  readonly primaryField: AbstractField;
  readonly secondaryField: AbstractField;
  readonly stateChanges: Subject<FieldState>;
  _useSecondaryField: boolean = false;
  _omit: boolean;
  _omitByDefault: boolean;

  get state() {
    const state = !this._useSecondaryField
      ? this.primaryField.state
      : this.secondaryField.state;
    state.useSecondaryField = this._useSecondaryField;
    state.omit = this._omit;
    return state;
  }

  set useSecondaryField(useSecondaryField) {
    const changeDetected = this.useSecondaryField !== useSecondaryField;
    this._useSecondaryField = useSecondaryField;
    if (this.stateChanges && changeDetected) this.stateChanges.next(this.state);
  }

  get useSecondaryField() {
    return this._useSecondaryField;
  }

  set omit(omit: boolean) {
    this._omit = omit;
    this.stateChanges?.next(this.state);
  }

  get omit() {
    return this._omit;
  }

  constructor(
    primaryField: AbstractField,
    secondaryField: AbstractField,
    omitByDefault: boolean,
  ) {
    super();
    this.primaryField = primaryField;
    this.secondaryField = secondaryField;
    this._omitByDefault = omitByDefault;
    this._omit = this._omitByDefault;
    this.primaryField.stateChanges.subscribe(() => {
      if (!this._useSecondaryField) this.stateChanges?.next(this.state);
    });
    this.secondaryField.stateChanges.subscribe(() => {
      if (this._useSecondaryField) this.stateChanges?.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  setValue(valueObj: DualFieldSetValueArg) {
    if (valueObj.primaryFieldValue)
      this.primaryField.setValue(valueObj.primaryFieldValue);
    if (valueObj.secondaryFieldValue)
      this.secondaryField.setValue(valueObj.secondaryFieldValue);
    if (valueObj.useSecondaryField !== undefined)
      this.useSecondaryField = valueObj.useSecondaryField;
  }

  setState(stateObj: DualFieldSetStateArg) {
    if (stateObj.omit !== undefined) this.omit = stateObj.omit;
    if (stateObj.primaryFieldState)
      this.primaryField.setState(stateObj.primaryFieldState);
    if (stateObj.secondaryFieldState)
      this.secondaryField.setState(stateObj.secondaryFieldState);
    if (stateObj.useSecondaryField !== undefined)
      this.useSecondaryField = stateObj.useSecondaryField;
  }

  reset = () => {
    this._omit = this._omitByDefault;
    this.primaryField.reset();
    this.secondaryField.reset();
    this.useSecondaryField = false;
  }
}
