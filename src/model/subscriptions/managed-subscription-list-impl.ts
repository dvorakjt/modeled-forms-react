import { List, Item } from 'linked-list';
import { ManagedSubscriptionList } from '../types/subscriptions/managed-subscription-list.interface';
import { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';

interface ManagedSubscriptionListItem extends Item {
  subscription: ManagedSubscription;
}

export class ManagedSubscriptionListImpl implements ManagedSubscriptionList {
  private static ManagedSubscriptionListItemImpl = class
    extends Item
    implements ManagedSubscriptionListItem
  {
    subscription: ManagedSubscription;

    constructor(subscription: ManagedSubscription) {
      super();
      this.subscription = subscription;
      this.subscription.onDisposed(() => this.detach());
    }
  };

  readonly #subscriptionList = new List<ManagedSubscriptionListItem>();

  get size() {
    return this.#subscriptionList.size;
  }

  add(subscription: ManagedSubscription): void {
    this.#subscriptionList.append(
      new ManagedSubscriptionListImpl.ManagedSubscriptionListItemImpl(
        subscription,
      ),
    );
  }

  unsubscribeAll(): void {
    this.#subscriptionList.toArray().forEach(item => {
      item.subscription.unsubscribe();
    });
  }
}
