import type { MultiInputValidatedField } from "../types/fields/multi-input-validated-field.interface";
import type { Field } from "../types/fields/field.interface";
import { MultiInputValidityReducer } from "../types/reducers/multi-input-validator-reducer.interface";
import { State } from "../types/state/state.interface";
import { ManagedSubject } from "../types/subscriptions/managed-subject.interface";
import { FieldState } from "../types/state/field-state.interface";
import { copyObject } from "../util/copy-object";
import { ManagedObservableFactory } from "../types/subscriptions/managed-observable-factory.interface";
import { BehaviorSubject } from "rxjs";
import { DualFieldSetStateArg } from "../types/state/dual-field-set-state-arg.interface";
import { DualFieldSetValueArg } from "../types/state/dual-field-set-value-arg.interface";
import { MultiInputValidator } from "../types/validators/multi-input/multi-input-validator.interface";

export abstract class AbstractMultiInputValidatedField implements MultiInputValidatedField {
  readonly stateChanges: ManagedSubject<State<string>>;
  protected readonly baseField : Field;
  readonly #multiInputValidatorReducer : MultiInputValidityReducer;

  get state() : FieldState {
    return {
      ...copyObject(this.baseField.state),
      validity : this.calculateValidity()
    }
  }

  get omit() {
    return this.baseField.omit;
  }

  constructor(baseField : Field, multiInputValidityReducer : MultiInputValidityReducer, managedObservableFactory : ManagedObservableFactory) {
    this.baseField = baseField;
    this.#multiInputValidatorReducer = multiInputValidityReducer;
    this.baseField.stateChanges.subscribe(() => {
      if(this.stateChanges) this.stateChanges.next(this.state);
    });
    this.#multiInputValidatorReducer.validityChanges.subscribe(() => {
      if(this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = managedObservableFactory.createManagedSubject(new BehaviorSubject(this.state));
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