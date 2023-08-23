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

export class UserFacingMultiInputValidatedDualField extends AbstractDualField implements MultiInputValidatedFormElement
{
  readonly #baseField: AbstractDualField;
  readonly #multiInputValidatorReducer: MultiInputValidatorValidityReducer;
  stateChanges: Subject<State<string>>;
  
  get state(): FieldState {
    return {
      ...copyObject(this.#baseField.state),
      validity: this.calculateValidity(),
    };
  }

  get omit() {
    return this.#baseField.omit;
  }

  set omit(omit : boolean) {
    this.#baseField.omit = omit;
  } 

  get primaryField() {
    return this.#baseField.primaryField;
  }

  get secondaryField() {
    return this.#baseField.secondaryField;
  }

  set useSecondaryField(useSecondaryField) {
    this.#baseField.useSecondaryField = useSecondaryField;
  }

  get useSecondaryField() {
    return this.#baseField.useSecondaryField;
  }

  constructor(
    baseField: AbstractDualField,
    multiInputValidityReducer: MultiInputValidatorValidityReducer,
  ) {
    super();
    this.#baseField = baseField;
    this.#multiInputValidatorReducer = multiInputValidityReducer;
    this.#baseField.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.#multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  setValue(value: DualFieldSetValueArg) {
    this.#baseField.setValue(value);
  }

  setState(state: DualFieldSetStateArg): void {
    this.#baseField.setState(state);
  }

  reset(): void {
    this.#baseField.reset();
  }

  addValidator(validator: MultiInputValidator): void {
    this.#multiInputValidatorReducer.addValidator(validator);
  }

  private calculateValidity() {
    return Math.min(
      this.#baseField.state.validity,
      this.#multiInputValidatorReducer.validity,
    );
  }
}
