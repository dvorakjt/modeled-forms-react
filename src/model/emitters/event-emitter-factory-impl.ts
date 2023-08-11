import { makeInjectable } from '../util/make-injectable';
import { EmitterFactory } from './emitter-factory.interface';
import { OneTimeEventEmitter } from './one-time-event-emitter.interface';
import { OneTimeValueEmitter } from './one-time-value-emitter.interface';
import { OneTimeEventEmitterImpl } from './one-time-event-emitter-impl';
import { OneTimeValueEmitterImpl } from './one-time-value-emitter-impl';

class EmitterFactoryImpl
  implements EmitterFactory
{
  createOneTimeEventEmitter(): OneTimeEventEmitter {
    return new OneTimeEventEmitterImpl();
  }
  createOneTimeValueEmitter<T>(): OneTimeValueEmitter<T> {
    return new OneTimeValueEmitterImpl<T>();
  }
}

makeInjectable(EmitterFactoryImpl);

export { EmitterFactoryImpl };