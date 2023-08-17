import { Validity } from './validity.enum';

export enum FinalizerValidity {
  FINALIZER_ERROR = Validity.ERROR - 1,
  FIELD_ERROR,
  FIELD_INVALID,
  FIELD_PENDING,
  FIELD_VALID_UNFINALIZABLE,
  VALID_FINALIZING,
  VALID_FINALIZED,
}
