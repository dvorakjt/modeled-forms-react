import { FieldState } from './field-state.interface';

export interface DualFieldSetStateArg {
  primaryFieldState?: Partial<FieldState>;
  secondaryFieldState?: Partial<FieldState>;
  useSecondaryField?: boolean;
  omit?: boolean;
}
