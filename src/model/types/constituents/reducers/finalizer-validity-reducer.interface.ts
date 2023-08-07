import { FinalizerValidity } from "../state/finalizer-validity.enum";

export interface FinalizerValidityReducer {
  finalizerValidity : FinalizerValidity;
  updateTallies(finalizerName : string, finalizerValidity : FinalizerValidity) : void;
}