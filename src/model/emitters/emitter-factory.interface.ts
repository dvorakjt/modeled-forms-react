import type { OneTimeEventEmitter } from './one-time-event-emitter.interface';
import { OneTimeValueEmitter } from './one-time-value-emitter.interface';

interface EmitterFactory {
  createOneTimeEventEmitter(): OneTimeEventEmitter;
  createOneTimeValueEmitter<T>(): OneTimeValueEmitter<T>;
}
const EmitterFactoryKey = 'EmitterFactory';
type EmitterFactoryKeyType = typeof EmitterFactoryKey;

export { EmitterFactoryKey, type EmitterFactory, type EmitterFactoryKeyType };
