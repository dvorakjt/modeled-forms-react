import { FieldValidityReducer } from "../types/reducers/field-validity-reducer.interface";
import { Validity } from "../types/state/validity.enum";

export class FieldValidityReducerImpl implements FieldValidityReducer {
  #errantFields = new Set<string>();
  #invalidFields = new Set<string>();
  #pendingFields = new Set<string>();
  #validUnfinalizableFields = new Set<string>();

  get validity() {
    if(this.#errantFields.size > 0) return Validity.ERROR;
    if(this.#invalidFields.size > 0) return Validity.INVALID;
    if(this.#pendingFields.size > 0) return Validity.PENDING;
    if(this.#validUnfinalizableFields.size > 0) return Validity.VALID_UNFINALIZABLE;
    return Validity.VALID_FINALIZABLE;
  }
  
  updateTallies(fieldName : string, validity : Validity) {
    this.updateTally(fieldName, validity, Validity.ERROR, this.#errantFields);
    this.updateTally(fieldName, validity, Validity.INVALID, this.#invalidFields);
    this.updateTally(fieldName, validity, Validity.PENDING, this.#pendingFields);
    this.updateTally(fieldName, validity, Validity.VALID_UNFINALIZABLE, this.#validUnfinalizableFields);
  }

  updateTally(fieldName : string, actualValidity : Validity, expectedValidity : Validity, set : Set<string>) {
    if(actualValidity === expectedValidity) set.add(fieldName);
    else set.delete(fieldName);
  }
}