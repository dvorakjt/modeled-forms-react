import { describe, test, expect, beforeEach } from 'vitest';
import { OneTimeEventEmitterFactoryImpl } from '../../../model/subscriptions/one-time-event-emitter-factory-impl';
import { OneTimeEventEmitterImpl } from '../../../model/subscriptions/one-time-event-emitter-impl';
import type { OneTimeEventEmitterFactory } from '../../../model/types/subscriptions/one-time-event-emitter-factory.interface';

describe('OneTimeEventEmitterFactoryImpl', () => {
  let oneTimeEventEmitterFactory: OneTimeEventEmitterFactory;

  beforeEach(() => {
    oneTimeEventEmitterFactory = new OneTimeEventEmitterFactoryImpl();
  });

  test('It returns an instance of OneTimeEventEmitter when createOneTimeEventEmitter() is called.', () => {
    const oneTimeEventEmitter =
      oneTimeEventEmitterFactory.createOneTimeEventEmitter();
    expect(oneTimeEventEmitter).toBeInstanceOf(OneTimeEventEmitterImpl);
  });
});
