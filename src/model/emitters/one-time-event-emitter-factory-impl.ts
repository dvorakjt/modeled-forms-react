import { OneTimeEmitterFactory } from '../types/emitters/one-time-emitter-factory.interface';
import { OneTimeEventEmitter } from '../types/emitters/one-time-event-emitter.interface';
import { OneTimeValueEmitter } from '../types/emitters/one-time-value-emitter.interface';
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
