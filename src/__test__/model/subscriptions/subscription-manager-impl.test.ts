import { describe, beforeEach, test, expect } from 'vitest';
import { ManagedObservable } from "../../../model/subscriptions/managed-observable";
import { SubscriptionManagerImpl } from "../../../model/subscriptions/subscription-manager-impl";
import { Observable, from, BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import type { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';
import { ManagedSubject } from '../../../model/subscriptions/managed-subject';

describe('SubscriptionManagerImpl', () => {
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
  });

  test('it returns a ManagedObservable when registerObservable is called with an Observable', () => {
    const observable = new Observable<void>((subscriber) => {
      subscriber.complete();
    });
    const managedObservable = subscriptionManager.registerObservable(observable);
    expect(managedObservable).toBeInstanceOf(ManagedObservable);
  });

  test('it returns a ManagedObservable when registerObservable is called with an Observable created with \'from\'', () => {
    const observable = from(new Promise<void>(resolve => resolve()));
    const managedObservable = subscriptionManager.registerObservable(observable);
    expect(managedObservable).toBeInstanceOf(ManagedObservable);
  });

  test('it returns a ManagedSubject when registerObservable is called with a BehaviorSubject.', () => {
    const subject = new BehaviorSubject('test');
    const managedSubject = subscriptionManager.registerObservable(subject);
    expect(managedSubject).toBeInstanceOf(ManagedSubject);
  });

  test('it returns a ManagedSubject when registerObservable is called with a ReplaySubject.', () => {
    const subject = new ReplaySubject();
    const managedSubject = subscriptionManager.registerObservable(subject);
    expect(managedSubject).toBeInstanceOf(ManagedSubject);
  });

  test('it unsubscribes from all subscriptions in its list and empties the list when unsubscribeAll is called.', () => {
    const subject = subscriptionManager.registerObservable(new Subject());
    const subscriptions = [];
    for(let i = 0; i < 5; i++) {
      subscriptions.push(subject.subscribe((next) => {
        console.log(next);
      }));
    }
    expect(subscriptionManager.count).toBe(5);
    subscriptionManager.unsubscribeAll();
    expect(subscriptionManager.count).toBe(0);
    for(const sub of subscriptions) {
      expect(sub.closed).toBe(true);
    }
  });
});

