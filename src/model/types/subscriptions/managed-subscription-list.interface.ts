import type { ManagedSubscription } from './managed-subscription.interface';

export interface ManagedSubscriptionList {
  get size(): number;
  add(subscription: ManagedSubscription): void; //should not need to know about list items outside the list
  unsubscribeAll(): void;
}
