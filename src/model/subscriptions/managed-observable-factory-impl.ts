import { ManagedObservableImpl } from './managed-observable-impl';
import { ManagedSubjectImpl } from './managed-subject-impl';
import { OnInitialSubscriptionHandlingBehaviorSubjectImpl } from './on-initial-subscription-handling-behavior-subject-impl';
import type { BehaviorSubject, Observable, Subject } from 'rxjs';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { ManagedObservable } from '../types/subscriptions/managed-observable.interface';
import type { OneTimeEventEmitterFactory } from '../types/subscriptions/one-time-event-emitter-factory.interface';
import type { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { OnInitialSubscriptionHandlingBehaviorSubject } from '../types/subscriptions/on-initial-subscription-handling-behavior-subject.interface';

export class ManagedObservableFactoryImpl implements ManagedObservableFactory {
  readonly #subscriptionManager: SubscriptionManager;
  readonly #oneTimeEventEmitterFactory: OneTimeEventEmitterFactory;

  constructor(
    subscriptionManager: SubscriptionManager,
    oneTimeEventEmitterFactory: OneTimeEventEmitterFactory,
  ) {
    this.#subscriptionManager = subscriptionManager;
    this.#oneTimeEventEmitterFactory = oneTimeEventEmitterFactory;
  }

  createManagedObservable<T>(observable: Observable<T>): ManagedObservable<T> {
    return new ManagedObservableImpl(observable, this.#subscriptionManager);
  }

  createManagedSubject<T>(subject: Subject<T>): ManagedSubject<T> {
    return new ManagedSubjectImpl(subject, this.#subscriptionManager);
  }

  createOnInitialSubscriptionHandlingBehaviorSubject<T>(
    subject: BehaviorSubject<T>,
  ): OnInitialSubscriptionHandlingBehaviorSubject<T> {
    return new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
      subject,
      this.#subscriptionManager,
      this.#oneTimeEventEmitterFactory.createOneTimeEventEmitter(),
    );
  }
}
