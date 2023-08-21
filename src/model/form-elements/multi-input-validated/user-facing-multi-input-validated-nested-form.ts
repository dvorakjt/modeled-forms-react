import { copyObject } from '../../util/copy-object';
import { BehaviorSubject, type Subject } from 'rxjs';
import type { State } from '../../state/state.interface';
import type { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';
import { AbstractNestedForm } from '../../forms/abstract-nested-form';
import { FormElementDictionary } from '../form-element-dictionary.type';
import { MultiInputValidatedFormElement } from './multi-input-validated-field.interface';
import { MultiInputValidatorValidityReducer } from '../../reducers/multi-input-validator-validity/multi-input-validator-validity-reducer.interface';

export class UserFacingMultiInputValidatedNestedForm extends AbstractNestedForm
  implements MultiInputValidatedFormElement
{
  stateChanges: Subject<State<any>>;
  #baseNestedForm : AbstractNestedForm;
  #multiInputValidatorReducer : MultiInputValidatorValidityReducer;

  get userFacingFields(): FormElementDictionary {
    return this.#baseNestedForm.userFacingFields;
  }

  get state(): State<any> {
    return {
      ...copyObject(this.#baseNestedForm.state),
      validity: this.calculateValidity(),
    };
  }

  set omit(omit : boolean) {
    this.#baseNestedForm.omit = omit;
  }

  get omit() : boolean {
    return this.#baseNestedForm.omit;
  }

  get firstNonValidFormElement(): Subject<string | undefined> {
    return this.#baseNestedForm.firstNonValidFormElement;
  }

  constructor(baseNestedForm : AbstractNestedForm, userFacingMultiInputValidityReducer: MultiInputValidatorValidityReducer) {
    super();
    this.#baseNestedForm = baseNestedForm;
    this.#multiInputValidatorReducer = userFacingMultiInputValidityReducer;
    this.#baseNestedForm.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.#multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }


  reset(): void {
    throw new Error('Method not implemented.');
  }

  addValidator(validator: MultiInputValidator): void {
    this.#multiInputValidatorReducer.addValidator(validator);
  }

  private calculateValidity() {
    return Math.min(
      this.#baseNestedForm.state.validity,
      this.#multiInputValidatorReducer.validity,
    );
  }
}
