import type { FieldState } from '../../state/field-state.interface';
import { Modified } from '../../state/modified.enum';
import type { Validity } from '../../state/validity.enum';
import { Visited } from '../../state/visited.enum';

export interface FieldStateReducer {
  get validity(): Validity;
  get visited(): Visited;
  get modified(): Modified;
  get omit(): boolean;

  updateTallies(fieldName: string, state: FieldState): void;
}
