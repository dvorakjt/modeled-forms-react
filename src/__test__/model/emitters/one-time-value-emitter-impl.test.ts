import { describe, beforeEach, test, vi, expect } from 'vitest';
import { OneTimeValueEmitterImpl } from '../../../model/emitters/one-time-value-emitter-impl';
import type { OneTimeValueEmitter } from '../../../model/types/emitters/one-time-value-emitter.interface';

describe('OneTimeEventEmitterImpl', () => {
  let oneTimeEventEmitter: OneTimeValueEmitter<string>;
  let cb: () => void;

  beforeEach(() => {
    oneTimeEventEmitter = new OneTimeValueEmitterImpl<string>();
    cb = vi.fn();
  });

  test('It does not call the cb passed to onValue() if setValue() has not been called.', () => {
    oneTimeEventEmitter.onValue(cb);
    expect(cb).not.toHaveBeenCalled();
  });

  test('It calls the cb immediately if setValue() has been called.', () => {
    const expectedValue = 'test';
    oneTimeEventEmitter.setValue(expectedValue);
    oneTimeEventEmitter.onValue(cb);
    expect(cb).toHaveBeenCalledWith(expectedValue);
  });

  test('If onValue() is called first, the callback is called when setValue() is called.', () => {
    const expectedValue = 'test';
    oneTimeEventEmitter.onValue(cb);
    oneTimeEventEmitter.setValue(expectedValue)
    expect(cb).toHaveBeenCalledWith(expectedValue);
  });
});
