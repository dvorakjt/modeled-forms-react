/* eslint-disable @typescript-eslint/no-unused-vars */
import { BehaviorSubject, Observer, Subscription } from 'rxjs';
import { OnInitialSubscriptionHandlingBehaviorSubject } from './on-initial-subscription-handling-behavior-subject.interface';
import { OneTimeEventEmitter } from '../emitters/one-time-event-emitter.interface';

export class OnInitialSubscriptionHandlingBehaviorSubjectImpl<T>
  extends BehaviorSubject<T>
  implements OnInitialSubscriptionHandlingBehaviorSubject<T>
{
  readonly _onInitialSubscriptionEventEmitter: OneTimeEventEmitter;

  constructor(
    initialValue: T,
    onInitialSubscriptionEventEmitter: OneTimeEventEmitter,
  ) {
    super(initialValue);
    this._onInitialSubscriptionEventEmitter = onInitialSubscriptionEventEmitter;
  }

  subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null,
  ): Subscription {
    let subscription: Subscription;
    if (observerOrNext) {
      if (typeof observerOrNext === 'function')
        subscription = super.subscribe(observerOrNext, error, complete);
      else subscription = super.subscribe(observerOrNext);
    } else subscription = super.subscribe();
    this._onInitialSubscriptionEventEmitter.triggerEvent();
    return subscription;
  }

  onInitialSubscription(cb: () => void): void {
    this._onInitialSubscriptionEventEmitter.onEvent(cb);
  }
}
