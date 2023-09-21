import { MultiInputValidatorValidityReducer } from '../../reducers/multi-input-validator-validity/multi-input-validator-validity-reducer.interface';
import { StatefulFormElement } from '../stateful-form-element.interface';
import { OmittableFormElement } from '../omittable-form-element.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { State } from '../../state/state.interface';
import { MultiInputValidatedFormElement } from './multi-input-validated-field.interface';
import { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';
import { copyObject } from '../../util/copy-object';

export class FinalizerFacingMultiInputValidatedFormElement
  implements
    StatefulFormElement<any>,
    OmittableFormElement,
    MultiInputValidatedFormElement
{
  stateChanges: Subject<State<any>>;
  _baseFormElement: StatefulFormElement<any> & OmittableFormElement;
  _multiInputValidatorReducer: MultiInputValidatorValidityReducer;

  get state(): State<any> {
    return {
      ...copyObject(this._baseFormElement.state),
      validity: this._calculateValidity(),
    };
  }

  get omit(): boolean {
    return this._baseFormElement.omit;
  }

  constructor(
    baseFormElement: StatefulFormElement<any> & OmittableFormElement,
    finalizerFacingMultiInputValidityReducer: MultiInputValidatorValidityReducer,
  ) {
    this._baseFormElement = baseFormElement;
    this._multiInputValidatorReducer = finalizerFacingMultiInputValidityReducer;
    // this._baseFormElement.stateChanges.subscribe(() => {
    //   if (this.stateChanges) this.stateChanges.next(this.state);
    // });
    this._multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  addValidator(validator: MultiInputValidator): void {
    this._multiInputValidatorReducer.addValidator(validator);
  }

  _calculateValidity() {
    return Math.min(
      this._baseFormElement.state.validity,
      this._multiInputValidatorReducer.validity,
    );
  }
}
