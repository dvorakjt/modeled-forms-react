import type { ValidatorSuiteResult } from '../validators/validator-suite-result.interface';
import { Modified } from './modified-enum';
import { Visited } from './visited.enum';

export type State<T> = ValidatorSuiteResult<T> & {
  visited : Visited;
  modified : Modified;
  omit?: boolean;
  useSecondaryField?: boolean;
};
