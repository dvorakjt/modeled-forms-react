import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { Observable, of } from 'rxjs';
import { iocContainer } from './ioc-container';
import { ManagedObservableImpl } from '../../../model/subscriptions/managed-observable-impl';
import type { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';

describe('ManagedObservableImpl', () => {
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = iocContainer.SubscriptionManager;
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('Subscribers receive values from the observable.', () => {
    const expectedNumbers = [1, 2, 3]
    const observable = of(...expectedNumbers);

    const managedObservable = new ManagedObservableImpl(
      observable,
      subscriptionManager
    )
    let currentNumIndex = 0;
    managedObservable.subscribe(next => {
      expect(next).toBe(expectedNumbers[currentNumIndex++]);
    });
  });

  test('Subscribers receive errors from the observable.', () => {
    const expectedErrorMessage = 'Test Error';
    const observable = new Observable(subscriber => {
      subscriber.error(new Error(expectedErrorMessage));
    });
    const managedObservable = new ManagedObservableImpl(
      observable,
      subscriptionManager
    );
    managedObservable.subscribe({
      error: err => {
        expect(err.message).toBe(expectedErrorMessage)
      }
    });
  });

  test('Subscribers are notified when the observable completes.', () => {
    const completeFn = vi.fn();
    const observer = {
      complete : completeFn
    };
    const observable = new Observable(subscriber => {
      subscriber.complete();
    });
    const managedObservable = new ManagedObservableImpl(observable, subscriptionManager);
    managedObservable.subscribe(observer);
    expect(completeFn).toHaveBeenCalledOnce();
  });
});