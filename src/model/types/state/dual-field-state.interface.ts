import type { FieldState } from './field-state.interface';

export interface DualFieldState extends FieldState {
  useSecondaryField: boolean;
}
