import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { BehaviorSubject } from 'rxjs';
import { iocContainer } from './ioc-container';
import { OnInitialSubscriptionHandlingBehaviorSubjectImpl } from '../../../model/subscriptions/on-initial-subscription-handling-behavior-subject-impl';
import type { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';

describe('OnInitialSubscriptionHandlingSubjectImpl', () => {
  const oneTimeEventEmitterFactory = iocContainer.OneTimeEventEmitterFactory;
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = iocContainer.SubscriptionManager;
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('It calls the cb passed into onInitialSubscription when it is subscribed to the first time.', () => {
    const onInitialSubscriptionHandlingSubject = new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
      new BehaviorSubject<number>(1),
      subscriptionManager,
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    const onSubscribeFn = vi.fn();
    onInitialSubscriptionHandlingSubject.onInitialSubscription(onSubscribeFn);
    onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    expect(onSubscribeFn).toHaveBeenCalledOnce();
  });

  test('It calls the cb passed into onInitialSubscription when if it has already been subscribed to when onInitialSubscription is called.', () => {
    const onInitialSubscriptionHandlingSubject = new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
      new BehaviorSubject<number>(1),
      subscriptionManager,
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    const onSubscribeFn = vi.fn();
    onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    onInitialSubscriptionHandlingSubject.onInitialSubscription(onSubscribeFn);
    expect(onSubscribeFn).toHaveBeenCalledOnce();
  });

  test('It calls the cb passed into onInitialSubscription only once.', () => {
    const onInitialSubscriptionHandlingSubject = new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
      new BehaviorSubject<number>(1),
      subscriptionManager,
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    const onSubscribeFn = vi.fn();
    onInitialSubscriptionHandlingSubject.onInitialSubscription(onSubscribeFn);
    onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    expect(onSubscribeFn).toHaveBeenCalledOnce();
  });
});