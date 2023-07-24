import type { FieldState } from "./field-state.interface";

export interface DualFieldSetStateArg {
  primaryFieldState? : FieldState;
  secondaryFieldState? : FieldState;
  useSecondaryField? : boolean;
  omit? : boolean;
}