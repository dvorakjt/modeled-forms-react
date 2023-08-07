import { EmitterFactory } from '../../types/constituents/emitters/emitter-factory.interface';
import { OneTimeEventEmitter } from '../../types/constituents/emitters/one-time-event-emitter.interface';
import { OneTimeValueEmitter } from '../../types/constituents/emitters/one-time-value-emitter.interface';
import { OneTimeEventEmitterImpl } from './one-time-event-emitter-impl';
import { OneTimeValueEmitterImpl } from './one-time-value-emitter-impl';

export class EmitterFactoryImpl
  implements EmitterFactory
{
  createOneTimeEventEmitter(): OneTimeEventEmitter {
    return new OneTimeEventEmitterImpl();
  }
  createOneTimeValueEmitter<T>(): OneTimeValueEmitter<T> {
    return new OneTimeValueEmitterImpl<T>();
  }
}
