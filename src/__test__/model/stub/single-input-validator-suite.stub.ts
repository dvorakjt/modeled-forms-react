import { Observable } from "rxjs";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import { SingleInputValidatorSuite } from "../../../model/types/validators/single-input/single-input-validator-suite.interface";
import { ValidatorSuiteResult } from "../../../model/types/state/validator-suite-result.interface";

export class SingleInputValidatorSuiteStub<T> implements SingleInputValidatorSuite<T> {
  #subscriptionManager : SubscriptionManager;
  #returnValue : ValidatorSuiteResult<T>;

  constructor(subscriptionManager : SubscriptionManager, returnValue : ValidatorSuiteResult<T>) {
    this.#subscriptionManager = subscriptionManager;
    this.#returnValue = returnValue;
  }
  
  evaluate(value : T) {
    return this.#subscriptionManager.registerObservable<ValidatorSuiteResult<T>>(new Observable(subscriber => {
      subscriber.next({
        ...this.#returnValue,
        value
      });
    }));
  }
}