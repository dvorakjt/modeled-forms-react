import { FinalizerValidity } from "../state/finalizer-validity.enum";
import { Validity } from "../state/validity.enum";

export interface FinalizerValidityTranslator {
  translateFinalizerValidityToValidity(finalizerValidity : FinalizerValidity) : Validity;
  translateValidityToFinalizerValidity(validity : Validity) : FinalizerValidity;
}