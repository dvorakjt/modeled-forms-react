import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { Subject } from 'rxjs';
import { iocContainer } from './ioc-container';
import { ManagedSubjectImpl } from '../../../model/subscriptions/managed-subject-impl';
import type { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';

describe('ManagedSubjectImpl', () => {
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = iocContainer.SubscriptionManager;
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('Subscribers receive a new value when next() is called.', () => {
    const managedSubject = new ManagedSubjectImpl(new Subject<number>(), subscriptionManager);
    const nextFn = vi.fn();
    managedSubject.subscribe(nextFn);
    managedSubject.next(1);
    expect(nextFn).toBeCalledWith(1);
  });

  test('Subscribers receive an error when error() is called.', () => {
    const managedSubject = new ManagedSubjectImpl(new Subject<void>(), subscriptionManager);
    const errorFn = vi.fn();
    const observer = {
      error : errorFn
    }
    managedSubject.subscribe(observer);
    const expectedError = Error('Test Error');
    managedSubject.error(expectedError);
    expect(errorFn).toHaveBeenCalledWith(expectedError);
  });

  test('Subscribers are notified of the subject\'s completion when complete() is called.', () => {
    const managedSubject = new ManagedSubjectImpl(new Subject<void>(), subscriptionManager);
    const completeFn = vi.fn();
    const observer = {
      complete : completeFn
    }
    managedSubject.subscribe(observer);
    managedSubject.complete();
    expect(completeFn).toHaveBeenCalledOnce();
  });
});