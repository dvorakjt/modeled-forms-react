import { Subscription } from "rxjs";
import { SubscriptionListItem } from './subscription-list-item';

export class ManagedSubscription {
  #subscription : Subscription;
  #subscriptionListItem : SubscriptionListItem;

  get closed() {
    return this.#subscription.closed;
  }

  constructor(subscription : Subscription, subscriptionListItem : SubscriptionListItem) {
    this.#subscription = subscription;
    this.#subscriptionListItem = subscriptionListItem;
  }

  unsubscribe() {
    this.#subscriptionListItem.detach();
    return this.#subscription.unsubscribe();
  }
}