import type { Validity } from "../state/validity.enum";
import type { ManagedSubject } from "../subscriptions/managed-subject.interface";
import type { MultiInputValidator } from "../validators/multi-input/multi-input-validator.interface";

export interface MultiInputValidityReducer {
  validityChanges : ManagedSubject<Validity>;
  validity : Validity;
  addValidator(multiFieldValidator : MultiInputValidator) : void;
}