import { describe, beforeEach, afterEach, test, expect } from 'vitest';
import { Subject } from 'rxjs';
import { getTestContainer, Services } from '../test-container';
import { ManagedSubscriptionFactoryImpl } from '../../../model/subscriptions/managed-subscription-factory-impl';
import { ManagedSubscriptionImpl } from '../../../model/subscriptions/managed-subscription-impl';
import type { ManagedSubscription } from '../../../model/types/subscriptions/managed-subscription.interface';
import type { ManagedSubscriptionFactory } from '../../../model/types/subscriptions/managed-subscription-factory.interface';
import type { OneTimeEventEmitterFactory } from '../../../model/types/subscriptions/one-time-event-emitter-factory.interface';

describe('ManagedSubscriptionFactory', () => {
  const container = getTestContainer();
  const oneTimeEventEmitterFactory = container.get<OneTimeEventEmitterFactory>(
    Services.OneTimeEventEmitterFactory,
  );
  let managedSubscriptionFactory: ManagedSubscriptionFactory;
  let subscriptions: Array<ManagedSubscription>;

  beforeEach(() => {
    managedSubscriptionFactory = new ManagedSubscriptionFactoryImpl(
      oneTimeEventEmitterFactory,
    );
    subscriptions = [];
  });

  afterEach(() => {
    subscriptions.forEach(subscription => subscription.unsubscribe());
  });

  test('It returns an instance of ManagedSubscriptionImpl when createManagedSubscriptionFromObservableAndObserver() is called.', () => {
    const subscription =
      managedSubscriptionFactory.createManagedSubscriptionFromObservableAndObserver(
        new Subject<void>(),
        {},
      );
    subscriptions.push(subscription);
    expect(subscription).toBeInstanceOf(ManagedSubscriptionImpl);
  });
});
