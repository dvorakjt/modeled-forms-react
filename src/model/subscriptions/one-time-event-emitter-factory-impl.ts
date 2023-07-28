import { OneTimeEventEmitterFactory } from '../types/subscriptions/one-time-event-emitter-factory.interface';
import { OneTimeEventEmitter } from '../types/subscriptions/one-time-event-emitter.interface';
import { OneTimeEventEmitterImpl } from './one-time-event-emitter-impl';

export class OneTimeEventEmitterFactoryImpl
  implements OneTimeEventEmitterFactory
{
  createOneTimeEventEmitter(): OneTimeEventEmitter {
    return new OneTimeEventEmitterImpl();
  }
}
