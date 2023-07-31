import { ManagedObservable } from '../../subscriptions/managed-observable';
import { ValidatorSuiteResult } from './validator-suite-result.interface';

export interface ValidatorSuiteResultsObject<T> {
  syncResult: ValidatorSuiteResult<T>;
  observable?: ManagedObservable<ValidatorSuiteResult<T>>;
}
