import { copyObject } from "../util/copy-object";
import { BehaviorSubject, type Subject } from "rxjs";
import type { MultiInputValidatedField } from "../../types/constituents/fields/multi-input-validated-field.interface";
import type { Field } from "../../types/constituents/fields/field.interface";
import type { MultiInputValidatorValidityReducer } from "../../types/constituents/reducers/multi-input-validator-validity-reducer.interface";
import type { State } from "../../types/constituents/state/state.interface";
import type { FieldState } from "../../types/constituents/state/field-state.interface";
import type { DualFieldSetStateArg } from "../../types/constituents/state/dual-field-set-state-arg.interface";
import type { DualFieldSetValueArg } from "../../types/constituents/state/dual-field-set-value-arg.interface";
import type { MultiInputValidator } from "../../types/constituents/validators/multi-input/multi-input-validator.interface";

export abstract class AbstractMultiInputValidatedField implements MultiInputValidatedField {
  readonly stateChanges: Subject<State<string>>;
  protected readonly baseField : Field;
  readonly #multiInputValidatorReducer : MultiInputValidatorValidityReducer;

  get state() : FieldState {
    return {
      ...copyObject(this.baseField.state),
      validity : this.calculateValidity()
    }
  }

  get omit() {
    return this.baseField.omit;
  }

  constructor(baseField : Field, multiInputValidityReducer : MultiInputValidatorValidityReducer) {
    this.baseField = baseField;
    this.#multiInputValidatorReducer = multiInputValidityReducer;
    this.baseField.stateChanges.subscribe(() => {
      if(this.stateChanges) this.stateChanges.next(this.state);
    });
    this.#multiInputValidatorReducer.validityChanges.subscribe(() => {
      if(this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  setState(state: FieldState | DualFieldSetStateArg): void {
    this.baseField.setState(state);
  }

  setValue(value: string | DualFieldSetValueArg): void {
    this.baseField.setValue(value);
  }

  reset(): void {
    this.baseField.reset();
  }

  addValidator(validator: MultiInputValidator): void {
    this.#multiInputValidatorReducer.addValidator(validator);
  }

  private calculateValidity() {
    return Math.min(this.baseField.state.validity, this.#multiInputValidatorReducer.validity);
  }
}