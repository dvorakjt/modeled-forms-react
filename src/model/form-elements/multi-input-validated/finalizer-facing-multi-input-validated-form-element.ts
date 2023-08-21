import { MultiInputValidatorValidityReducer } from '../../reducers/multi-input-validator-validity/multi-input-validator-validity-reducer.interface';
import { StatefulFormElement } from '../stateful-form-element.interface';
import { OmittableFormElement } from '../omittable-form-element.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { State } from '../../state/state.interface';
import { MultiInputValidatedFormElement } from './multi-input-validated-field.interface';
import { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';
import { copyObject } from '../../util/copy-object';

export class FinalizerFacingMultiInputValidatedFormElement implements StatefulFormElement<any>, OmittableFormElement, MultiInputValidatedFormElement {
  stateChanges: Subject<State<any>>;
  #baseFormElement : StatefulFormElement<any> & OmittableFormElement;
  #multiInputValidatorReducer : MultiInputValidatorValidityReducer;
  
  get state(): State<any> {
    return {
      ...copyObject(this.#baseFormElement.state),
      validity: this.calculateValidity(),
    };
  }
  
  get omit(): boolean {
    return this.#baseFormElement.omit;
  }

  constructor(
    baseFormElement : StatefulFormElement<any> & OmittableFormElement,
    finalizerFacingMultiInputValidityReducer: MultiInputValidatorValidityReducer,
  ) {
    this.#baseFormElement = baseFormElement;
    this.#multiInputValidatorReducer = finalizerFacingMultiInputValidityReducer;
    this.#baseFormElement.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.#multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject(this.state);
  }

  addValidator(validator: MultiInputValidator): void {
    this.#multiInputValidatorReducer.addValidator(validator);
  }
  
  private calculateValidity() {
    return Math.min(
      this.#baseFormElement.state.validity,
      this.#multiInputValidatorReducer.validity,
    );
  }
}
