import { ManagedObservableImpl } from './managed-observable-impl';
import { ManagedSubjectImpl } from './managed-subject-impl';
import { OnInitialSubscriptionHandlingSubjectImpl } from './on-initial-subscription-handling-subject-impl';
import type { Observable, Subject } from 'rxjs';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { ManagedObservable } from '../types/subscriptions/managed-observable.interface';
import type { OneTimeEventEmitterFactory } from '../types/subscriptions/one-time-event-emitter-factory.interface';
import type { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { OnInitialSubscriptionHandlingSubject } from '../types/subscriptions/on-initial-subscription-handling-subject.interface';

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

  createOnInitialSubscriptionHandlingSubject<T>(
    subject: Subject<T>,
  ): OnInitialSubscriptionHandlingSubject<T> {
    return new OnInitialSubscriptionHandlingSubjectImpl(
      subject,
      this.#subscriptionManager,
      this.#oneTimeEventEmitterFactory.createOneTimeEventEmitter(),
    );
  }
}
