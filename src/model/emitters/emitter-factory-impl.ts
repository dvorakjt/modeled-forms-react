import { EmitterFactory, EmitterFactoryKey, EmitterFactoryKeyType } from './emitter-factory.interface';
import { OneTimeEventEmitter } from './one-time-event-emitter.interface';
import { OneTimeValueEmitter } from './one-time-value-emitter.interface';
import { OneTimeEventEmitterImpl } from './one-time-event-emitter-impl';
import { OneTimeValueEmitterImpl } from './one-time-value-emitter-impl';
import { autowire } from 'undecorated-di';

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

export default autowire<EmitterFactoryKeyType, EmitterFactory, EmitterFactoryImpl>(
  EmitterFactoryImpl,
  EmitterFactoryKey
);