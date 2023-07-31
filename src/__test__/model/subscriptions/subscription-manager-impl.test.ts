import { describe, test, afterEach, expect, beforeEach } from 'vitest';
import { Subject } from 'rxjs';
import { Services, getTestContainer } from '../test-container';
import { SubscriptionManagerImpl } from '../../../model/subscriptions/subscription-manager-impl';
import { ManagedSubscriptionImpl } from '../../../model/subscriptions/managed-subscription-impl';
import type { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';
import type { ManagedSubscription } from '../../../model/types/subscriptions/managed-subscription.interface';
import type { ManagedSubscriptionFactory } from '../../../model/types/subscriptions/managed-subscription-factory.interface';
import type { ManagedSubscriptionList } from '../../../model/types/subscriptions/managed-subscription-list.interface';

describe('SubscriptionManagerImpl', () => {
  const container = getTestContainer();
  let subscriptionManager: SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl(
      container.get<ManagedSubscriptionFactory>(
        Services.ManagedSubscriptionFactory,
      ),
      container.get<ManagedSubscriptionList>(Services.ManagedSubscriptionList),
    );
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('It returns a ManagedSubscription when createAndRegisterManagedSubscription is called.', () => {
    const subscription =
      subscriptionManager.createAndRegisterManagedSubscription(
        new Subject<void>(),
        () => {
          return;
        },
      );
    expect(subscription).toBeInstanceOf(ManagedSubscriptionImpl);
  });

  test('It unsubscribes from all subscriptions when unsubscribeAll() is called.', () => {
    const subscriptions: Array<ManagedSubscription> = [];
    for (let i = 0; i < 3; i++) {
      subscriptions.push(
        subscriptionManager.createAndRegisterManagedSubscription(
          new Subject<void>(),
          () => {
            return;
          },
        ),
      );
    }
    subscriptionManager.unsubscribeAll();
    subscriptions.forEach(subscription =>
      expect(subscription.closed).toBe(true),
    );
  });
});
