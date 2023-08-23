import { copyObject } from '../../util/copy-object';
import { BehaviorSubject, type Subject } from 'rxjs';
import { AbstractField } from '../../fields/base/abstract-field';
import type { MultiInputValidatedFormElement } from './multi-input-validated-field.interface';
import type { MultiInputValidatorValidityReducer } from '../../reducers/multi-input-validator-validity/multi-input-validator-validity-reducer.interface';
import type { State } from '../../state/state.interface';
import type { FieldState } from '../../state/field-state.interface';
import type { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import type { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import type { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';

export abstract class AbstractMultiInputValidatedField
  implements MultiInputValidatedFormElement
{
  readonly stateChanges: Subject<State<string>>;
  protected readonly baseField: AbstractField;
  readonly #multiInputValidatorReducer: MultiInputValidatorValidityReducer;

  get state(): FieldState {
    return {
      ...copyObject(this.baseField.state),
      validity: this.calculateValidity(),
    };
  }

  get omit() {
    return this.baseField.omit;
  }

  constructor(
    baseField: AbstractField,
    multiInputValidityReducer: MultiInputValidatorValidityReducer,
  ) {
    this.baseField = baseField;
    this.#multiInputValidatorReducer = multiInputValidityReducer;
    this.baseField.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.#multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
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
    return Math.min(
      this.baseField.state.validity,
      this.#multiInputValidatorReducer.validity,
    );
  }
}
