import { List } from "linked-list";
import { SubscriptionListItem } from "./subscription-list-item";
import type { SubscriptionManager } from "../types/subscriptions/subscription-manager.interface";
import { Observable, Subject } from "rxjs";
import { ManagedSubject } from "./managed-subject";
import { ManagedObservable } from "./managed-observable";

export class SubscriptionManagerImpl implements SubscriptionManager {
  #subscriptionList = new List<SubscriptionListItem>();

  get count() {
    return this.#subscriptionList.size;
  }

  registerObservable<T>(observable: Observable<T>) {
    return new ManagedObservable<T>(observable, this.#subscriptionList);
  }

  registerSubject<T>(subject: Subject<T>, postSubscriptionFn? : () => void) {
    return new ManagedSubject<T>(subject, this.#subscriptionList, postSubscriptionFn);
  }

  unsubscribeAll() {
    let subscriptionListItem = this.#subscriptionList.head;
    while(subscriptionListItem !== null) {
      subscriptionListItem.subscription && subscriptionListItem.subscription.unsubscribe();
      subscriptionListItem.detach();
      subscriptionListItem = this.#subscriptionList.head;
    }
  }
}