import { copyObject } from '../../util/copy-object';
import { BehaviorSubject, type Subject } from 'rxjs';
import type { State } from '../../state/state.interface';
import type { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';
import { AbstractNestedForm } from '../../forms/abstract-nested-form';
import { FormElementDictionary } from '../form-element-dictionary.type';
import { MultiInputValidatedFormElement } from './multi-input-validated-field.interface';
import { MultiInputValidatorValidityReducer } from '../../reducers/multi-input-validator-validity/multi-input-validator-validity-reducer.interface';
import { ExtractedValueDictionary } from '../../extracted-values/extracted-value-dictionary.type';

export class UserFacingMultiInputValidatedNestedForm
  extends AbstractNestedForm
  implements MultiInputValidatedFormElement
{
  stateChanges: Subject<State<any>>;
  _baseNestedForm: AbstractNestedForm;
  _multiInputValidatorReducer: MultiInputValidatorValidityReducer;

  get userFacingFields(): FormElementDictionary {
    return this._baseNestedForm.userFacingFields;
  }

  get extractedValues(): ExtractedValueDictionary {
    return this._baseNestedForm.extractedValues;
  }

  get state(): State<any> {
    return {
      ...copyObject(this._baseNestedForm.state),
      validity: this._calculateValidity(),
    };
  }

  set omit(omit: boolean) {
    this._baseNestedForm.omit = omit;
  }

  get omit(): boolean {
    return this._baseNestedForm.omit;
  }

  get firstNonValidFormElement(): string | undefined {
    return this._baseNestedForm.firstNonValidFormElement;
  }

  get firstNonValidFormElementChanges(): Subject<string | undefined> {
    return this._baseNestedForm.firstNonValidFormElementChanges;
  }

  constructor(
    baseNestedForm: AbstractNestedForm,
    userFacingMultiInputValidityReducer: MultiInputValidatorValidityReducer,
  ) {
    super();
    this._baseNestedForm = baseNestedForm;
    this._multiInputValidatorReducer = userFacingMultiInputValidityReducer;
    this._baseNestedForm.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this._multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  reset(): void {
    this._baseNestedForm.reset();
  }

  addValidator(validator: MultiInputValidator): void {
    this._multiInputValidatorReducer.addValidator(validator);
  }

  _calculateValidity() {
    return Math.min(
      this._baseNestedForm.state.validity,
      this._multiInputValidatorReducer.validity,
    );
  }
}
