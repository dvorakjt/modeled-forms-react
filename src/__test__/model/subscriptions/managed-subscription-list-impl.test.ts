import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import { Subject } from 'rxjs';
import { iocContainer } from './ioc-container';
import { ManagedSubscriptionListImpl } from '../../../model/subscriptions/managed-subscription-list-impl';
import type { ManagedSubscriptionList } from '../../../model/types/subscriptions/managed-subscription-list.interface';
import type { ManagedSubscription } from '../../../model/types/subscriptions/managed-subscription.interface';

describe('ManagedSubscriptionListImpl', () => {
  const managedSubscriptionFactory = iocContainer.ManagedSubscriptionFactory;
  let managedSubscriptionList : ManagedSubscriptionList;

  beforeEach(() => {
    managedSubscriptionList = new ManagedSubscriptionListImpl();
  });

  afterEach(() => {
    managedSubscriptionList.unsubscribeAll();
  });

  test('It appends an item to the list when add() is called.', () => {
    managedSubscriptionList.add(getDefaultManagedSubscription());
    expect(managedSubscriptionList.size).toBe(1);
  });

  test('It removes an item from the list when the onDispose method of the subscription is called.', () => {
    const managedSubscription = getDefaultManagedSubscription();
    managedSubscriptionList.add(managedSubscription);
    managedSubscription.unsubscribe();
    expect(managedSubscriptionList.size).toBe(0);
  });

  test('It calls unsubscribe on all managedSubscriptions when unsubscribeAll() is called.', () => {
    const subscriptions : Array<ManagedSubscription> = [...generateManagedSubscriptions(3)];

    subscriptions.forEach(subscription => {
      vi.spyOn(subscription, 'unsubscribe');
      managedSubscriptionList.add(subscription);
    });

    managedSubscriptionList.unsubscribeAll();

    subscriptions.forEach(subscription => {
      expect(subscription.unsubscribe).toHaveBeenCalledOnce();
    });
  });

  test('It empties the list when unsubscribeAll() is called.', () => {
    for(const subscription of generateManagedSubscriptions(3)) {
      managedSubscriptionList.add(subscription);
    }
    managedSubscriptionList.unsubscribeAll();
    expect(managedSubscriptionList.size).toBe(0);
  });

  function getDefaultManagedSubscription() {
    return managedSubscriptionFactory.createManagedSubscriptionFromObservableAndObserver(
      new Subject<void>(),
      () => {
        return;
      }
    )
  }

  function* generateManagedSubscriptions(numberToGenerate : number) {
    for(let i = 0; i < numberToGenerate; i++) {
      yield getDefaultManagedSubscription();
    }
  }
});