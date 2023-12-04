import type { FieldState } from '../../state/field-state.interface';
import { Focused } from '../../state/focused.enum';
import { Modified } from '../../state/modified.enum';
import type { Validity } from '../../state/validity.enum';
import { Visited } from '../../state/visited.enum';

export interface FieldStateReducer {
  get validity(): Validity;
  get visited(): Visited;
  get modified(): Modified;
  get focused() : Focused;
  get omit(): boolean;

  updateTallies(fieldName: string, state: FieldState): void;
}
