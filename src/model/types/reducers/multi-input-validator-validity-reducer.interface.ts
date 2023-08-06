import type { Subject } from "rxjs";
import type { Validity } from "../state/validity.enum";
import type { MultiInputValidator } from "../validators/multi-input/multi-input-validator.interface";

export interface MultiInputValidatorValidityReducer {
  validityChanges : Subject<Validity>;
  validity : Validity;
  addValidator(multiFieldValidator : MultiInputValidator) : void;
}