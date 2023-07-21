import { Observable, Observer } from "rxjs";
import { List } from "linked-list";
import { SubscriptionListItem } from "./subscription-list-item";
import { ManagedSubscription } from "./managed-subscription";

export class ManagedObservable<T> {
  protected observable : Observable<T>;
  protected subscriptionList : List<SubscriptionListItem>;

  constructor(observable : Observable<T>, subscriptionList : List<SubscriptionListItem>) {
    this.observable = observable;
    this.subscriptionList = subscriptionList;
  }

  subscribe(observerOrNext : Partial<Observer<T>> | ((value: T) => void)) {
    const subscriptionListItem = new SubscriptionListItem();

    let observer;

    if(typeof observerOrNext === 'function') {
      observer = {
        next: observerOrNext,
        complete: () => {
          subscriptionListItem.detach();
        }
      }
    } else {
      observer = {
        ...observerOrNext,
        complete: () => {
          subscriptionListItem.detach();
          observerOrNext.complete && observerOrNext.complete();
        }
      }
    }

    const subscription = new ManagedSubscription(this.observable.subscribe(observer), subscriptionListItem);
    subscriptionListItem.subscription = subscription;
    this.subscriptionList.append(subscriptionListItem);
    return subscription;
  }
}