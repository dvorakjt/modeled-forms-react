import { describe, beforeEach, test, expect, vi } from 'vitest';
import { SubscriptionManagerImpl } from '../../../model/subscriptions/subscription-manager-impl';
import type { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';
import { Subject } from 'rxjs';
import { ManagedSubject } from '../../../model/subscriptions/managed-subject';

describe('managedSubject', () => {
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
  });
  
  test('it should call .next on its subject when its own .next method is called.', () => {
    const subject = new Subject<any>();
    vi.spyOn(subject, 'next');
    const managedSubject = subscriptionManager.registerObservable(subject) as ManagedSubject<any>;
    managedSubject.next('test');
    expect(subject.next).toHaveBeenCalled();
  });

  test('it should call .error on its subject when its own .error method is called.', () => {
    const subject = new Subject<any>();
    vi.spyOn(subject, 'error');
    const managedSubject = subscriptionManager.registerObservable(subject) as ManagedSubject<any>;
    managedSubject.error(new Error('test error'));
    expect(subject.error).toHaveBeenCalled();
  });

  test('it should call .complete on its subject when its own .complete method is called', () => {
    const subject = new Subject<any>();
    vi.spyOn(subject, 'complete');
    const managedSubject = subscriptionManager.registerObservable(subject) as ManagedSubject<any>;
    managedSubject.complete();
    expect(subject.complete).toHaveBeenCalled();
  });
});