import { ManagedSubscriptionImpl } from './managed-subscription-impl';
import type { Observable, Observer } from 'rxjs';
import type { ManagedSubscriptionFactory } from '../types/subscriptions/managed-subscription-factory.interface';
import type { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';
import type { OneTimeEventEmitterFactory } from '../types/subscriptions/one-time-event-emitter-factory.interface';

export class ManagedSubscriptionFactoryImpl
  implements ManagedSubscriptionFactory
{
  readonly #oneTimeEventEmitterFactory: OneTimeEventEmitterFactory;

  constructor(oneTimeEventEmitterFactory: OneTimeEventEmitterFactory) {
    this.#oneTimeEventEmitterFactory = oneTimeEventEmitterFactory;
  }

  createManagedSubscriptionFromObservableAndObserver<T>(
    observable: Observable<T>,
    observerOrNext: Partial<Observer<T>> | ((value: T) => void),
  ): ManagedSubscription {
    return new ManagedSubscriptionImpl(
      observable,
      observerOrNext,
      this.#oneTimeEventEmitterFactory.createOneTimeEventEmitter(),
    );
  }
}
