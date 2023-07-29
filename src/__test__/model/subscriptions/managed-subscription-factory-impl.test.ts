import { describe, beforeEach, afterEach, test, expect } from 'vitest';
import { Subject } from 'rxjs';
import { iocContainer } from './ioc-container';
import { ManagedSubscriptionFactoryImpl } from '../../../model/subscriptions/managed-subscription-factory-impl';
import { ManagedSubscriptionImpl } from '../../../model/subscriptions/managed-subscription-impl';
import type { ManagedSubscription } from '../../../model/types/subscriptions/managed-subscription.interface';
import type { ManagedSubscriptionFactory } from '../../../model/types/subscriptions/managed-subscription-factory.interface';

describe('ManagedSubscriptionFactory', () => {
  const oneTimeEventEmitterFactory = iocContainer.OneTimeEventEmitterFactory;
  let managedSubscriptionFactory : ManagedSubscriptionFactory;
  let subscriptions : Array<ManagedSubscription>;

  beforeEach(() => {
    managedSubscriptionFactory = new ManagedSubscriptionFactoryImpl(oneTimeEventEmitterFactory);
    subscriptions = [];
  });

  afterEach(() => {
    subscriptions.forEach(subscription => subscription.unsubscribe());
  });

  test('It returns an instance of ManagedSubscriptionImpl when createManagedSubscriptionFromObservableAndObserver() is called.', () => {
    const subscription = managedSubscriptionFactory.createManagedSubscriptionFromObservableAndObserver(
      new Subject<void>(),
      {}
    );
    subscriptions.push(subscription);
    expect(subscription).toBeInstanceOf(ManagedSubscriptionImpl);
  });
});