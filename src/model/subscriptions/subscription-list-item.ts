import { Item } from 'linked-list';
import { ManagedSubscription } from './managed-subscription';

export class SubscriptionListItem extends Item {
  subscription? : ManagedSubscription;

  constructor() {
    super();
  }
}