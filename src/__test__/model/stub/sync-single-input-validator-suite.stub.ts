import { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';
import { SingleInputValidatorSuite } from '../../../model/types/validators/single-input/single-input-validator-suite.interface';
import { ValidatorSuiteResult } from '../../../model/types/validators/validator-suite-result.interface';

export class SyncSingleInputValidatorSuiteStub<T>
  implements SingleInputValidatorSuite<T>
{
  #subscriptionManager: SubscriptionManager;
  #returnValue: ValidatorSuiteResult<T>;

  constructor(
    subscriptionManager: SubscriptionManager,
    returnValue: ValidatorSuiteResult<T>,
  ) {
    this.#subscriptionManager = subscriptionManager;
    this.#returnValue = returnValue;
  }

  evaluate(value: T) {
    return {
      syncResult: {
        ...this.#returnValue,
        value,
      },
    };
  }
}
