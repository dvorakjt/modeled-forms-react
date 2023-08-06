import { BehaviorSubject, type Subject } from "rxjs";
import { MultiInputValidatorValidityReducer } from "../types/reducers/multi-input-validator-validity-reducer.interface";
import { Validity } from "../types/state/validity.enum";
import { MultiInputValidator } from "../types/validators/multi-input/multi-input-validator.interface";
import { ValidityReducer } from "../types/reducers/validity-reducer.interface";

export class UserFacingMultiInputValidatorReducer implements MultiInputValidatorValidityReducer {
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
    multiFieldValidator.calculatedValidityChanges.subscribe((validityChange : Validity) => {
      this.#validityReducer.updateTallies(validatorId, validityChange);
      this.validityChanges.next(this.#validityReducer.validity);
    });
  }
}