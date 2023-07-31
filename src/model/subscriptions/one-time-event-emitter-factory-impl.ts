import { OneTimeEmitterFactory } from '../types/subscriptions/one-time-emitter-factory.interface';
import { OneTimeEventEmitter } from '../types/subscriptions/one-time-event-emitter.interface';
import { OneTimeValueEmitter } from '../types/subscriptions/one-time-value-emitter.interface';
import { OneTimeEventEmitterImpl } from './one-time-event-emitter-impl';
import { OneTimeValueEmitterImpl } from './one-time-value-emitter-impl';

export class OneTimeEmitterFactoryImpl
  implements OneTimeEmitterFactory
{
  createOneTimeEventEmitter(): OneTimeEventEmitter {
    return new OneTimeEventEmitterImpl();
  }
  createOneTimeValueEmitter<T>(): OneTimeValueEmitter<T> {
    return new OneTimeValueEmitterImpl<T>();
  }
}
