import { Observer, Subject } from 'rxjs';
import { OnInitialSubscriptionHandlingSubject } from '../types/subscriptions/on-initial-subscription-handling-subject.interface';
import { OneTimeEventEmitter } from '../types/subscriptions/one-time-event-emitter.interface';
import { ManagedSubjectImpl } from './managed-subject-impl';
import { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';
import { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';

export class OnInitialSubscriptionHandlingSubjectImpl<T>
  extends ManagedSubjectImpl<T>
  implements OnInitialSubscriptionHandlingSubject<T>
{
  readonly #onInitialSubscriptionEventEmitter: OneTimeEventEmitter;

  constructor(
    subject: Subject<T>,
    subscriptionManager: SubscriptionManager,
    onInitialSubscriptionEventEmitter: OneTimeEventEmitter,
  ) {
    super(subject, subscriptionManager);
    this.#onInitialSubscriptionEventEmitter = onInitialSubscriptionEventEmitter;
  }

  subscribe(
    observerOrNext: Partial<Observer<T>> | ((value: T) => void),
  ): ManagedSubscription {
    const subscription = super.subscribe(observerOrNext);
    this.#onInitialSubscriptionEventEmitter.triggerEvent();
    return subscription;
  }

  onInitialSubscription(cb: () => void): void {
    this.#onInitialSubscriptionEventEmitter.onEvent(cb);
  }
}
