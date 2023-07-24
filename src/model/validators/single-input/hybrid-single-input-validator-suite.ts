import { Observable } from "rxjs";
import { SubscriptionManager } from "../../types/subscriptions/subscription-manager.interface";
import { SingleInputValidatorSuite } from "../../types/validators/single-input/single-input-validator-suite.interface";
import { AsyncSingleInputValidatorSuite } from "./async-single-input-validator-suite";
import { SyncSingleInputValidatorSuite } from "./sync-single-input-validator-suite";
import { ValidatorSuiteResult } from "../../types/state/validator-suite-result.interface";
import { Validity } from "../../types/state/validity.enum";

export class HybridSingleInputValidatorSuite<T> implements SingleInputValidatorSuite<T> {
  #syncValidatorSuite : SyncSingleInputValidatorSuite<T>;
  #asyncValidatorSuite : AsyncSingleInputValidatorSuite<T>;
  #subscriptionManager : SubscriptionManager;
  constructor(
    syncValidatorSuite : SyncSingleInputValidatorSuite<T>, 
    asyncValidatorSuite : AsyncSingleInputValidatorSuite<T>,
    subscriptionManager : SubscriptionManager
  ) {
    this.#syncValidatorSuite = syncValidatorSuite;
    this.#asyncValidatorSuite = asyncValidatorSuite;
    this.#subscriptionManager = subscriptionManager;
  }
  evaluate(value : T) {
    return this.#subscriptionManager.registerObservable(new Observable<ValidatorSuiteResult<T>>(subscriber => {
      this.#syncValidatorSuite.evaluate(value).subscribe(syncResult => {
        if(syncResult.validity <= Validity.INVALID) {
          subscriber.next(syncResult);
          subscriber.complete();
        } else {
          this.#asyncValidatorSuite.evaluate(value).subscribe({
            next: (asyncUpdate) => {
              subscriber.next({
                ...asyncUpdate,
                messages: [...syncResult.messages, ...asyncUpdate.messages]
              });
            },
            complete: () => {
              subscriber.complete();
            }
          });
        }
      });
    }));
  }
}