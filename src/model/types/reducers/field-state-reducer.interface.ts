import type { FieldState } from '../state/field-state.interface';
import type { Validity } from '../state/validity.enum';

export interface FieldStateReducer {
  get validity(): Validity;
  get hasOmittedFields() : boolean;

  updateTallies(fieldName: string, state : FieldState): void;
  clear() : void;
}
