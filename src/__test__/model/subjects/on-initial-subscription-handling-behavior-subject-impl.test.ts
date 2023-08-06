import { describe, test, expect, vi } from 'vitest';
import { getTestContainer, Services } from '../test-container';
import { OnInitialSubscriptionHandlingBehaviorSubjectImpl } from '../../../model/subjects/on-initial-subscription-handling-behavior-subject-impl';
import type { EmitterFactory } from '../../../model/types/emitters/emitter-factory.interface';
import { BehaviorSubject } from 'rxjs';

describe('OnInitialSubscriptionHandlingSubjectImpl', () => {
  const container = getTestContainer();
  const OneTimeEmitterFactory = container.get<EmitterFactory>(
    Services.EmitterFactory,
  );

  test('It calls the cb passed into onInitialSubscription when it is subscribed to the first time.', () => {
    const onInitialSubscriptionHandlingSubject =
      new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
        1,
        OneTimeEmitterFactory.createOneTimeEventEmitter(),
      );
    const onSubscribeFn = vi.fn();
    onInitialSubscriptionHandlingSubject.onInitialSubscription(onSubscribeFn);
    const subscription = onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    expect(onSubscribeFn).toHaveBeenCalledOnce();
    subscription.unsubscribe();
  });

  test('It calls the cb passed into onInitialSubscription when if it has already been subscribed to when onInitialSubscription is called.', () => {
    const onInitialSubscriptionHandlingSubject =
      new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
        1,
        OneTimeEmitterFactory.createOneTimeEventEmitter(),
      );
    const onSubscribeFn = vi.fn();
    const subscription = onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    onInitialSubscriptionHandlingSubject.onInitialSubscription(onSubscribeFn);
    expect(onSubscribeFn).toHaveBeenCalledOnce();
    subscription.unsubscribe();
  });

  test('It calls the cb passed into onInitialSubscription only once.', () => {
    const onInitialSubscriptionHandlingSubject =
      new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
        1,
        OneTimeEmitterFactory.createOneTimeEventEmitter(),
      );
    const onSubscribeFn = vi.fn();
    onInitialSubscriptionHandlingSubject.onInitialSubscription(onSubscribeFn);
    const sub1 = onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    const sub2 = onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    const sub3 = onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    expect(onSubscribeFn).toHaveBeenCalledOnce();
    sub1.unsubscribe();
    sub2.unsubscribe();
    sub3.unsubscribe();
  });

  test('It calls super.subscribe() when an observer is passed into its subscribe method.', () => {
    const onInitialSubscriptionHandlingSubject =
      new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
        1,
        OneTimeEmitterFactory.createOneTimeEventEmitter(),
      );
    vi.spyOn(BehaviorSubject.prototype, 'subscribe');
    const subscription = onInitialSubscriptionHandlingSubject.subscribe(
      {
        next: () => {
          return;
        },
        error: () => {
          return;
        },
        complete: () => {
          return;
        }
      }
    );
    expect(BehaviorSubject.prototype.subscribe).toHaveBeenCalledOnce();
    subscription.unsubscribe();
  });

  test('It calls super.subscribe() when no arguments are passed into subscribe().', () => {
    const onInitialSubscriptionHandlingSubject =
      new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
        1,
        OneTimeEmitterFactory.createOneTimeEventEmitter(),
      );
    vi.spyOn(BehaviorSubject.prototype, 'subscribe');
    const subscription = onInitialSubscriptionHandlingSubject.subscribe();
    expect(BehaviorSubject.prototype.subscribe).toHaveBeenCalledOnce();
    subscription.unsubscribe();
  });
});
