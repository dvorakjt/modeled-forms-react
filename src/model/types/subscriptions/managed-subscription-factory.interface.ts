import type { Observable, Observer } from 'rxjs';
import type { ManagedSubscription } from './managed-subscription.interface';

export interface ManagedSubscriptionFactory {
  createManagedSubscriptionFromObservableAndObserver<T>(
    observable: Observable<T>,
    observerOrNext: Partial<Observer<T>> | ((value: T) => void),
  ): ManagedSubscription;
}
