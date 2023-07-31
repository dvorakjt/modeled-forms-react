import type { ManagedObservable } from '../../subscriptions/managed-observable.interface';
import type { ValidatorSuiteResult } from './validator-suite-result.interface';

export interface ValidatorSuiteResultsObject<T> {
  syncResult: ValidatorSuiteResult<T>;
  observable?: ManagedObservable<ValidatorSuiteResult<T>>;
}
