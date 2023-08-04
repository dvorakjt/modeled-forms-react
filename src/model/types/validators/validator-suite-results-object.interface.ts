import type { Observable } from 'rxjs';
import { ValidatorSuiteResult } from './validator-suite-result.interface';

export interface ValidatorSuiteResultsObject<T> {
  syncResult: ValidatorSuiteResult<T>;
  observable?: Observable<ValidatorSuiteResult<T>>;
}
