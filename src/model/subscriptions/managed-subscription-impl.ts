import type { Observable, Observer, Subscription } from 'rxjs';
import type { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';
import type { OneTimeEventEmitter } from '../types/subscriptions/one-time-event-emitter.interface';

export class ManagedSubscriptionImpl implements ManagedSubscription {
  readonly #resourceDisposedEventEmitter: OneTimeEventEmitter;
  readonly #subscription: Subscription;

  get closed() {
    return this.#subscription.closed;
  }

  constructor(
    observable: Observable<any>,
    observerOrNext: Partial<Observer<any>> | ((value: any) => void),
    resourceDisposedEventEmitter: OneTimeEventEmitter,
  ) {
    this.#resourceDisposedEventEmitter = resourceDisposedEventEmitter;
    const observer = this.createDisposeOnCompleteObserver(observerOrNext);
    this.#subscription = observable.subscribe(observer);
  }

  unsubscribe(): void {
    this.#subscription.unsubscribe();
    this.dispose();
  }

  onDisposed(cb: () => void): void {
    this.#resourceDisposedEventEmitter.onEvent(cb);
  }

  private createDisposeOnCompleteObserver(
    observerOrNext: Partial<Observer<unknown>> | ((value: unknown) => void),
  ): Partial<Observer<unknown>> {
    let observer;

    if (typeof observerOrNext === 'function') {
      observer = {
        next: observerOrNext,
        complete: () => {
          this.dispose();
        },
      };
    } else {
      observer = {
        ...observerOrNext,
        complete: () => {
          this.dispose();
          observerOrNext.complete && observerOrNext.complete();
        },
      };
    }

    return observer;
  }

  private dispose() {
    this.#resourceDisposedEventEmitter.triggerEvent();
  }
}
