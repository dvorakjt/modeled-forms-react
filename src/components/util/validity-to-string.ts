import { Validity } from "../../model/state/validity.enum";

export function validityToString(validity : Validity) {
  switch(validity) {
    case Validity.ERROR :
      return 'error';
    case Validity.INVALID :
      return 'invalid';
    case Validity.PENDING :
      return 'pending';
    case Validity.VALID_UNFINALIZABLE :
    case Validity.VALID_FINALIZABLE :
      return 'valid';
  }
}