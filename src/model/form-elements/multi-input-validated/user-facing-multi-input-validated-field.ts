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
  readonly #baseField: AbstractField;
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

  set omit(omit: boolean) {
    this.#baseField.omit = omit;
  }

  constructor(
    baseField: AbstractField,
    userFacingMultiInputValidityReducer: MultiInputValidatorValidityReducer,
  ) {
    super();
    this.#baseField = baseField;
    this.#multiInputValidatorReducer = userFacingMultiInputValidityReducer;
    // this.#baseField.stateChanges.subscribe(() => {
    //   if (this.stateChanges) this.stateChanges.next(this.state);
    // });
    this.#multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
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
