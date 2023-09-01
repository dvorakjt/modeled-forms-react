import { Validity } from "../../model/state/validity.enum";

export function validityToString(validity : Validity) {
  switch(validity) {
    case Validity.ERROR :
      return 'ERROR';
    case Validity.INVALID :
      return 'INVALID';
    case Validity.PENDING :
      return 'PENDING';
    case Validity.VALID_UNFINALIZABLE :
    case Validity.VALID_FINALIZABLE :
      return 'VALID';
  }
}