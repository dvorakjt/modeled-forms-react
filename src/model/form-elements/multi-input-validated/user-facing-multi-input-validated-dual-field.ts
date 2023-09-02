import { AbstractDualField } from '../../fields/base/abstract-dual-field';
import type { MultiInputValidatorValidityReducer } from '../../reducers/multi-input-validator-validity/multi-input-validator-validity-reducer.interface';
import type { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import type { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import { MultiInputValidatedFormElement } from './multi-input-validated-field.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { State } from '../../state/state.interface';
import { FieldState } from '../../state/field-state.interface';
import { copyObject } from '../../util/copy-object';
import { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';

export class UserFacingMultiInputValidatedDualField
  extends AbstractDualField
  implements MultiInputValidatedFormElement
{
  readonly _baseField: AbstractDualField;
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

  get interactions() {
    return this._baseField.interactions;
  }

  get interactionsChanges() {
    return this._baseField.interactionsChanges;
  }


  get primaryField() {
    return this._baseField.primaryField;
  }

  get secondaryField() {
    return this._baseField.secondaryField;
  }

  set useSecondaryField(useSecondaryField) {
    this._baseField.useSecondaryField = useSecondaryField;
  }

  get useSecondaryField() {
    return this._baseField.useSecondaryField;
  }

  constructor(
    baseField: AbstractDualField,
    multiInputValidityReducer: MultiInputValidatorValidityReducer,
  ) {
    super();
    this._baseField = baseField;
    this._multiInputValidatorReducer = multiInputValidityReducer;
    this._baseField.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this._multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  setValue(value: DualFieldSetValueArg) {
    this._baseField.setValue(value);
  }

  setState(state: DualFieldSetStateArg): void {
    this._baseField.setState(state);
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
