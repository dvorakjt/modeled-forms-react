import type { ValidatorSuiteResult } from '../validators/validator-suite-result.interface';

export type State<T> = ValidatorSuiteResult<T> & { omit?: boolean, useSecondaryField?: boolean; };
