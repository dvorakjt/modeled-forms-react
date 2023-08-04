import type { OneTimeEventEmitter } from './one-time-event-emitter.interface';
import { OneTimeValueEmitter } from './one-time-value-emitter.interface';

export interface OneTimeEmitterFactory {
  createOneTimeEventEmitter(): OneTimeEventEmitter;
  createOneTimeValueEmitter<T>() : OneTimeValueEmitter<T>;
}
