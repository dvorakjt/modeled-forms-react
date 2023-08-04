import 'reflect-metadata';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import { OneTimeEmitterFactoryImpl } from '../../model/emitters/one-time-event-emitter-factory-impl';
import { ValidityReducerImpl } from '../../model/reducers/validity-reducer-impl';
import type { OneTimeEmitterFactory } from '../../model/types/emitters/one-time-emitter-factory.interface';
import type { ValidityReducer } from '../../model/types/reducers/validity-reducer.interface';

export enum Services {
  OneTimeEmitterFactory = 'OneTimeEmitterFactory',
  ValidityReducer = 'ValidityReducer'
}

export function getTestContainer() {
  helpers.annotate(OneTimeEmitterFactoryImpl);
  helpers.annotate(ValidityReducerImpl);

  const container = new Container();
  container
    .bind<OneTimeEmitterFactory>(Services.OneTimeEmitterFactory)
    .to(OneTimeEmitterFactoryImpl)
    .inTransientScope();
  container
    .bind<ValidityReducer>(Services.ValidityReducer)
    .to(ValidityReducerImpl)
    .inTransientScope();

  return container;
}
