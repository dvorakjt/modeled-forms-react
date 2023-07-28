import type { Observer } from 'rxjs';
import type { ManagedSubscription } from './managed-subscription.interface';

export interface ManagedObservable<T> {
  subscribe(
    observerOrNext: Partial<Observer<T>> | ((value: T) => void),
  ): ManagedSubscription;
}
