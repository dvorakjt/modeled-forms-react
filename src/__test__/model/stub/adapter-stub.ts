import { ReplaySubject } from "rxjs";
import { ManagedSubject } from "../../../model/subscriptions/managed-subject";
import { Adapter } from "../../../model/types/adapters/adapter.interface";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";

export class AdapterStub<T> implements Adapter<T> {
  stream : ManagedSubject<T>;

  constructor(subscriptionManager : SubscriptionManager) {
    this.stream = subscriptionManager.registerSubject(new ReplaySubject<T>());
  }
}