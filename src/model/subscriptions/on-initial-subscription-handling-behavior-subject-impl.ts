import { BehaviorSubject, Observer } from 'rxjs';
import { OnInitialSubscriptionHandlingBehaviorSubject } from '../types/subscriptions/on-initial-subscription-handling-behavior-subject.interface';
import { OneTimeEventEmitter } from '../types/subscriptions/one-time-event-emitter.interface';
import { ManagedSubjectImpl } from './managed-subject-impl';
import { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';
import { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';

export class OnInitialSubscriptionHandlingBehaviorSubjectImpl<T>
  extends ManagedSubjectImpl<T>
  implements OnInitialSubscriptionHandlingBehaviorSubject<T>
{
  readonly #onInitialSubscriptionEventEmitter: OneTimeEventEmitter;

  constructor(
    subject: BehaviorSubject<T>,
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
