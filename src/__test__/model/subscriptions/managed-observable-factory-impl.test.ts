import { describe, test, expect } from 'vitest';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { getTestContainer, Services } from '../test-container';
import { ManagedObservableImpl } from '../../../model/subscriptions/managed-observable-impl';
import { ManagedSubjectImpl } from '../../../model/subscriptions/managed-subject-impl';
import { OnInitialSubscriptionHandlingBehaviorSubjectImpl } from '../../../model/subscriptions/on-initial-subscription-handling-behavior-subject-impl';
import { ManagedObservableFactoryImpl } from '../../../model/subscriptions/managed-observable-factory-impl';
import type { OneTimeEmitterFactory } from '../../../model/types/subscriptions/one-time-emitter-factory.interface';
import type { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';

describe('ManagedObservableFactoryImpl', () => {
  const container = getTestContainer();
  const OneTimeEmitterFactory = container.get<OneTimeEmitterFactory>(
    Services.OneTimeEmitterFactory,
  );
  const subscriptionManager = container.get<SubscriptionManager>(
    Services.SubscriptionManager,
  );
  const managedObservableFactory = new ManagedObservableFactoryImpl(
    subscriptionManager,
    OneTimeEmitterFactory,
  );

  test('It returns an instance of ManagedObservableImpl when createManagedObservable() is called.', () => {
    expect(
      managedObservableFactory.createManagedObservable(of(1, 2, 3)),
    ).toBeInstanceOf(ManagedObservableImpl);
  });

  test('It returns an instance of ManagedSubject when createManagedSubject() is called.', () => {
    expect(
      managedObservableFactory.createManagedSubject(new Subject<void>()),
    ).toBeInstanceOf(ManagedSubjectImpl);
  });

  test('It returns an instance of OnInitialSubscriptionHandlingBehaviorSubjectImpl when createOnInitialSubscriptionHandlingBehaviorSubject is called.', () => {
    expect(
      managedObservableFactory.createOnInitialSubscriptionHandlingBehaviorSubject(
        new BehaviorSubject(1),
      ),
    ).toBeInstanceOf(OnInitialSubscriptionHandlingBehaviorSubjectImpl);
  });
});
