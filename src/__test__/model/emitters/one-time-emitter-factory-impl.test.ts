import { describe, test, expect, beforeEach } from 'vitest';
import { OneTimeEmitterFactoryImpl } from '../../../model/emitters/one-time-event-emitter-factory-impl';
import { OneTimeEventEmitterImpl } from '../../../model/emitters/one-time-event-emitter-impl';
import { OneTimeValueEmitterImpl } from '../../../model/emitters/one-time-value-emitter-impl';
import type { OneTimeEmitterFactory } from '../../../model/types/emitters/one-time-emitter-factory.interface';

describe('OneTimeEmitterFactoryImpl', () => {
  let OneTimeEmitterFactory: OneTimeEmitterFactory;

  beforeEach(() => {
    OneTimeEmitterFactory = new OneTimeEmitterFactoryImpl();
  });

  test('It returns an instance of OneTimeEventEmitter when createOneTimeEventEmitter() is called.', () => {
    const oneTimeEventEmitter =
      OneTimeEmitterFactory.createOneTimeEventEmitter();
    expect(oneTimeEventEmitter).toBeInstanceOf(OneTimeEventEmitterImpl);
  });

  test('It returns an instance of OneTimeValueEmitter when createOneTimeValueEmitter() is called.', () => {
    const oneTimeValueEmitter = 
      OneTimeEmitterFactory.createOneTimeValueEmitter<string>();
    expect(oneTimeValueEmitter).toBeInstanceOf(OneTimeValueEmitterImpl);
  });
});
