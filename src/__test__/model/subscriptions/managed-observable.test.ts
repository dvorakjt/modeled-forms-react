import { describe, beforeEach, test, expect } from 'vitest';
import { SubscriptionManagerImpl } from '../../../model/subscriptions/subscription-manager-impl';
import type { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';
import { Subject } from 'rxjs';
import { ManagedSubject } from '../../../model/subscriptions/managed-subject';

describe('ManagedObservable', () => {
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
  });
  
  test('it should remove the corresponding subscriptionListItem from the subscription list when complete() is called when a fn is passed into subscribe().', () => {
    const subject = new Subject<any>();
    const managedSubject = subscriptionManager.registerSubject(subject);
    managedSubject.subscribe(next => console.log(next));
    expect(subscriptionManager.count).toBe(1);
    (managedSubject as ManagedSubject<any>).complete();
    expect(subscriptionManager.count).toBe(0);
  });

  test('it should remove the corresponding subscriptionListItem from the subscription list when complete() is called when an obj is passed into subscribe().', () => {
    const subject = new Subject();
    const managedSubject = subscriptionManager.registerSubject(subject);
    managedSubject.subscribe({
      next: next => console.log(next),
      complete: () => console.log("complete")
    });
    expect(subscriptionManager.count).toBe(1);
    (managedSubject as ManagedSubject<any>).complete();
    expect(subscriptionManager.count).toBe(0);
  });
});