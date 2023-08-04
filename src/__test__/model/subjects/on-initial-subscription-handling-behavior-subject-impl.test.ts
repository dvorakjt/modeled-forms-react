import { describe, test, expect, vi } from 'vitest';
import { getTestContainer, Services } from '../test-container';
import { OnInitialSubscriptionHandlingBehaviorSubjectImpl } from '../../../model/subjects/on-initial-subscription-handling-behavior-subject-impl';
import type { OneTimeEmitterFactory } from '../../../model/types/emitters/one-time-emitter-factory.interface';

describe('OnInitialSubscriptionHandlingSubjectImpl', () => {
  const container = getTestContainer();
  const OneTimeEmitterFactory = container.get<OneTimeEmitterFactory>(
    Services.OneTimeEmitterFactory,
  );

  test('It calls the cb passed into onInitialSubscription when it is subscribed to the first time.', () => {
    const onInitialSubscriptionHandlingSubject =
      new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
        1,
        OneTimeEmitterFactory.createOneTimeEventEmitter(),
      );
    const onSubscribeFn = vi.fn();
    onInitialSubscriptionHandlingSubject.onInitialSubscription(onSubscribeFn);
    onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    expect(onSubscribeFn).toHaveBeenCalledOnce();
  });

  test('It calls the cb passed into onInitialSubscription when if it has already been subscribed to when onInitialSubscription is called.', () => {
    const onInitialSubscriptionHandlingSubject =
      new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
        1,
        OneTimeEmitterFactory.createOneTimeEventEmitter(),
      );
    const onSubscribeFn = vi.fn();
    onInitialSubscriptionHandlingSubject.subscribe(() => {
      return;
    });
    onInitialSubscriptionHandlingSubject.onInitialSubscription(onSubscribeFn);
    expect(onSubscribeFn).toHaveBeenCalledOnce();
  });

  test('It calls the cb passed into onInitialSubscription only once.', () => {
    const onInitialSubscriptionHandlingSubject =
      new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
        1,
        OneTimeEmitterFactory.createOneTimeEventEmitter(),
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
