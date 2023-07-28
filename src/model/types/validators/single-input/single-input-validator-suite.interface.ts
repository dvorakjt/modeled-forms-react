import { ValidatorSuiteResultsObject } from '../validator-suite-results-object.interface';

export interface SingleInputValidatorSuite<T> {
  evaluate(value: T): ValidatorSuiteResultsObject<T>;
}
