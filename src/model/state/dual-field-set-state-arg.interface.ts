import type { ValidatorSuiteResult } from '../validators/validator-suite-result.interface';

export interface DualFieldSetStateArg {
  primaryFieldState?: ValidatorSuiteResult<string>;
  secondaryFieldState?: ValidatorSuiteResult<string>;
  useSecondaryField?: boolean;
  omit?: boolean;
}
