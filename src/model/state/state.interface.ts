import type { ValidatorSuiteResult } from '../validators/validator-suite-result.interface';
import { Modified } from './modified.enum';
import { Visited } from './visited.enum';
import { Focused } from './focused.enum';

export type State<T> = ValidatorSuiteResult<T> & {
  visited: Visited;
  modified: Modified;
  focused : Focused;
  omit?: boolean;
  useSecondaryField?: boolean;
};
