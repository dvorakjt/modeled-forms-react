import { BehaviorSubject, type Subject } from "rxjs";
import { MultiInputValidatorValidityReducer } from "../../types/constituents/reducers/multi-input-validator-validity-reducer.interface";
import { Validity } from "../../types/constituents/state/validity.enum";
import { MultiInputValidator } from "../../types/constituents/validators/multi-input/multi-input-validator.interface";
import { ValidityReducer } from "../../types/constituents/reducers/validity-reducer.interface";

export class FinalizerFacingMultiInputValidatorReducer implements MultiInputValidatorValidityReducer {
  validityChanges: Subject<Validity>;
  #validityReducer : ValidityReducer;
  #multiInputValidators : Array<MultiInputValidator> = [];

  get validity() {
    return this.#validityReducer.validity;
  }
  
  constructor(validityReducer : ValidityReducer) {
    this.#validityReducer = validityReducer;
    this.validityChanges = new BehaviorSubject<Validity>(this.#validityReducer.validity);
  }

  addValidator(multiFieldValidator: MultiInputValidator): void {
    const validatorId = String(this.#multiInputValidators.length);
    this.#multiInputValidators.push(multiFieldValidator);
    multiFieldValidator.overallValidityChanges.subscribe((validityChange : Validity) => {
      this.#validityReducer.updateTallies(validatorId, validityChange);
      this.validityChanges.next(this.#validityReducer.validity);
    });
  }
}