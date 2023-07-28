import type { OneTimeEventEmitter } from './one-time-event-emitter.interface';

export interface OneTimeEventEmitterFactory {
  createOneTimeEventEmitter(): OneTimeEventEmitter;
}
