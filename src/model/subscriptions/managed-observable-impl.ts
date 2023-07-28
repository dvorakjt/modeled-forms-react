import type { Observable, Observer } from 'rxjs';
import type { ManagedObservable } from '../types/subscriptions/managed-observable.interface';
import type { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';
import type { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';

export class ManagedObservableImpl<T> implements ManagedObservable<T> {
  protected readonly observable: Observable<T>;
  readonly #subscriptionManager: SubscriptionManager;

  constructor(
    observable: Observable<T>,
    subscriptionManager: SubscriptionManager,
  ) {
    this.observable = observable;
    this.#subscriptionManager = subscriptionManager;
  }

  subscribe(
    observerOrNext: Partial<Observer<T>> | ((value: T) => void),
  ): ManagedSubscription {
    return this.#subscriptionManager.createAndRegisterManagedSubscription(
      this.observable,
      observerOrNext,
    );
  }
}
