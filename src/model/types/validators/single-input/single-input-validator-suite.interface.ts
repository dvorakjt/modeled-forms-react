import { ManagedObservable } from "../../../subscriptions/managed-observable";
import { ValidatorSuiteResult } from "../../state/validator-suite-result.interface";

export interface SingleInputValidatorSuite<T> {
  evaluate(value : T) : ManagedObservable<ValidatorSuiteResult<T>>;
}