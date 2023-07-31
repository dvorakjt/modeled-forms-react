import { Observable, Observer } from 'rxjs';
import { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';
import { ManagedSubscriptionList } from '../types/subscriptions/managed-subscription-list.interface';
import { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';
import { ManagedSubscriptionFactory } from '../types/subscriptions/managed-subscription-factory.interface';

export class SubscriptionManagerImpl implements SubscriptionManager {
  readonly #managedSubscriptionFactory: ManagedSubscriptionFactory;
  readonly #managedSubscriptionList: ManagedSubscriptionList;

  constructor(
    managedSubscriptionFactory: ManagedSubscriptionFactory,
    managedSubscriptionList: ManagedSubscriptionList,
  ) {
    this.#managedSubscriptionFactory = managedSubscriptionFactory;
    this.#managedSubscriptionList = managedSubscriptionList;
  }

  createAndRegisterManagedSubscription<T>(
    observable: Observable<T>,
    observerOrNext: Partial<Observer<T>> | ((value: T) => void),
  ): ManagedSubscription {
    const managedSubscription =
      this.#managedSubscriptionFactory.createManagedSubscriptionFromObservableAndObserver(
        observable,
        observerOrNext,
      );
    this.#managedSubscriptionList.add(managedSubscription);
    return managedSubscription;
  }

  unsubscribeAll(): void {
    this.#managedSubscriptionList.unsubscribeAll();
  }
}
