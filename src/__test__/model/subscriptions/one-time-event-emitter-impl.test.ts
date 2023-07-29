import { describe, beforeEach, test, vi, expect } from "vitest";
import { OneTimeEventEmitterImpl } from "../../../model/subscriptions/one-time-event-emitter-impl";
import type { OneTimeEventEmitter } from "../../../model/types/subscriptions/one-time-event-emitter.interface";

describe('OneTimeEventEmitterImpl', () => {
  let oneTimeEventEmitter : OneTimeEventEmitter
  let cb : () => void;

  beforeEach(() => {
    oneTimeEventEmitter = new OneTimeEventEmitterImpl();
    cb = vi.fn();
  });

  test('It does not call the cb passed to onEvent() if triggerEvent() has not been called.', () => {
    oneTimeEventEmitter.onEvent(cb);
    expect(cb).not.toHaveBeenCalledOnce();
  });

  test('It calls the cb immediately if triggerEvent() has been called.', () => {
    oneTimeEventEmitter.triggerEvent();
    oneTimeEventEmitter.onEvent(cb);
    expect(cb).toHaveBeenCalledOnce();
  });

  test('If onEvent() is called first, the callback is called when triggerEvent() is called.', () => {
    oneTimeEventEmitter.onEvent(cb);
    oneTimeEventEmitter.triggerEvent();
    expect(cb).toHaveBeenCalledOnce();
  });
});