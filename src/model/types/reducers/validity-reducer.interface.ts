import type { Validity } from "../state/validity.enum";

export interface ValidityReducer {
  get validity(): Validity;

  updateTallies(fieldName: string, validity: Validity): void;
}