import { ManagedSubscriptionImpl } from './managed-subscription-impl';
import type { Observable, Observer } from 'rxjs';
import type { ManagedSubscriptionFactory } from '../types/subscriptions/managed-subscription-factory.interface';
import type { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';
import type { OneTimeEmitterFactory } from '../types/subscriptions/one-time-emitter-factory.interface';

export class ManagedSubscriptionFactoryImpl
  implements ManagedSubscriptionFactory
{
  readonly OneTimeEmitterFactory: OneTimeEmitterFactory;

  constructor(OneTimeEmitterFactory: OneTimeEmitterFactory) {
    this.OneTimeEmitterFactory = OneTimeEmitterFactory;
  }

  createManagedSubscriptionFromObservableAndObserver<T>(
    observable: Observable<T>,
    observerOrNext: Partial<Observer<T>> | ((value: T) => void),
  ): ManagedSubscription {
    return new ManagedSubscriptionImpl(
      observable,
      observerOrNext,
      this.OneTimeEmitterFactory.createOneTimeEventEmitter(),
    );
  }
}
