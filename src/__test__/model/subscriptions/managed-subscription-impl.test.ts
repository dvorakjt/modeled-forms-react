import { describe, test, vi, afterEach, expect } from 'vitest';
import { Subject } from 'rxjs';
import { iocContainer } from './ioc-container';
import { ManagedSubscriptionImpl } from '../../../model/subscriptions/managed-subscription-impl';
import type { ManagedSubscription } from '../../../model/types/subscriptions/managed-subscription.interface';

describe('ManagedSubscriptionImpl', () => {
  const oneTimeEventEmitterFactory = iocContainer.OneTimeEventEmitterFactory;
  let managedSubscription : ManagedSubscription;

  afterEach(() => {
    managedSubscription.unsubscribe();
  }); 

  test('It unsubscribes from the subscription when unsubscribe() is called.', () => {
    managedSubscription = new ManagedSubscriptionImpl(
      new Subject<void>(),
      {},
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    managedSubscription.unsubscribe();
    expect(managedSubscription.closed).toBe(true);
  });

  test('It calls the cb passed to onDispose() when unsubscribe() is called.', () => {
    const onDisposeCb = vi.fn();
    managedSubscription = new ManagedSubscriptionImpl(
      new Subject<void>(),
      {},
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    managedSubscription.onDisposed(onDisposeCb);
    managedSubscription.unsubscribe();
    expect(onDisposeCb).toHaveBeenCalledOnce();
  });

  test('It calls the cb passed to onDispose() if unsubscribe() was previously called.', () => {
    const onDisposeCb = vi.fn();
    managedSubscription = new ManagedSubscriptionImpl(
      new Subject<void>(),
      {},
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    managedSubscription.unsubscribe();
    managedSubscription.onDisposed(onDisposeCb);
    expect(onDisposeCb).toHaveBeenCalledOnce();
  });

  test('It calls the cb passed to onDispose() when the observable completes and a partial observer with no complete method was passed into the constructor.', () => {
    const subject = new Subject<void>();
    const onDisposeCb = vi.fn();
    managedSubscription = new ManagedSubscriptionImpl(
      subject,
      {},
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    managedSubscription.onDisposed(onDisposeCb);
    subject.complete();
    expect(onDisposeCb).toHaveBeenCalledOnce();
  });

  test('It calls the cb passed to onDispose() when the observable completes and a partial observer with a complete method was passed into the constructor.', () => {
    const subject = new Subject<void>();
    const onDisposeCb = vi.fn();
    managedSubscription = new ManagedSubscriptionImpl(
      subject,
      {
        complete : () => {
          return;
        }
      },
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    managedSubscription.onDisposed(onDisposeCb);
    subject.complete();
    expect(onDisposeCb).toHaveBeenCalledOnce();
  });

  test('It calls the complete method of the partial observer passed into the constructor.', () =>{
    const subject = new Subject<void>();
    const completeMethod = vi.fn();
    managedSubscription = new ManagedSubscriptionImpl(
      subject,
      {
        complete : completeMethod
      },
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    subject.complete();
    expect(completeMethod).toHaveBeenCalledOnce();
  });

  test('It calls the next method of the partial observer passed into the constructor.', () => {
    const subject = new Subject<void>();
    const nextMethod = vi.fn();
    managedSubscription = new ManagedSubscriptionImpl(
      subject,
      {
        next : nextMethod
      },
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    subject.next();
    subject.next();
    subject.next();
    expect(nextMethod).toHaveBeenCalledTimes(3);
  });

  test('It calls the error method of the partial observer passed into the constructor.', () => {
    const subject = new Subject<void>();
    const errorMethod = vi.fn();
    managedSubscription = new ManagedSubscriptionImpl(
      subject,
      {
        error : errorMethod
      },
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    subject.error(new Error());
    expect(errorMethod).toHaveBeenCalledOnce();
  });

  test('It calls the cb passed to onDispose() when the observable completes and a subscribe function was passed into the constructor.', () => {
    const subject = new Subject<void>();
    const onDisposeCb = vi.fn();
    managedSubscription = new ManagedSubscriptionImpl(
      subject,
      () => {
        return;
      },
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    managedSubscription.onDisposed(onDisposeCb);
    subject.complete();
    expect(onDisposeCb).toHaveBeenCalledOnce();
  });

  test('It calls the subscribe method passed into the constructor when the observable emits a new value.', () => {
    const subject = new Subject<void>();
    const subscribeFn = vi.fn();
    managedSubscription = new ManagedSubscriptionImpl(
      subject,
      subscribeFn,
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    subject.next();
    subject.next();
    subject.next();
    expect(subscribeFn).toHaveBeenCalledTimes(3);
  });

  test('It calls the cb passed to onDispose() when the observable has previously completed.', () => {
    const subject = new Subject<void>();
    const onDisposeCb = vi.fn();
    const managedSubscription = new ManagedSubscriptionImpl(
      subject,
      {},
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    subject.complete();
    managedSubscription.onDisposed(onDisposeCb);
    expect(onDisposeCb).toHaveBeenCalledOnce();
  }); 

  test('Once set, onDispose is called only once even if the subject completes and unsubscribe() is called.', () => {
    const subject = new Subject<void>();
    const onDisposeCb = vi.fn();
    const managedSubscription = new ManagedSubscriptionImpl(
      subject,
      {},
      oneTimeEventEmitterFactory.createOneTimeEventEmitter()
    );
    managedSubscription.onDisposed(onDisposeCb);
    subject.complete();
    managedSubscription.unsubscribe();
    expect(onDisposeCb).toHaveBeenCalledOnce();
  }); 
});