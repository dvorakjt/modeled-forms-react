import { Validity } from "../state/validity.enum";

export interface FieldValidityReducer {
  get validity() : Validity;

  updateTallies(fieldName : string, validity : Validity) : void;

}