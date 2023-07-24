import type { FieldState } from "./field-state.interface";

export interface DualFieldState {
  primaryFieldState? : FieldState;
  secondaryFieldState? : FieldState;
  useSecondaryField? : boolean;
  omit? : boolean;
}