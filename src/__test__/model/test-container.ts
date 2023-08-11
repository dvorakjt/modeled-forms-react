import 'reflect-metadata';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import { EmitterFactoryImpl } from '../../model/emitters/event-emitter-factory-impl';
import { ValidityReducerImpl } from '../../model/reducers/validity/validity-reducer-impl';
import { ReducerFactoryImpl } from '../../model/reducers/reducer-factory-impl';
import { ProxyProducerFactory } from '../../model/proxies/proxy-producer-factory.interface';
import { AggregatorFactoryImpl } from '../../model/aggregators/aggregator-factory-impl';
import type { EmitterFactory } from '../../model/emitters/emitter-factory.interface';
import type { ValidityReducer } from '../../model/reducers/validity/validity-reducer.interface';
import type { ReducerFactory } from '../../model/reducers/reducer-factory.interface';
import type { AggregatorFactory } from '../../model/aggregators/aggregator-factory.interface';
import { ProxyProducerFactoryImpl } from '../../model/proxies/proxy-producer-factory-impl';
import { SubjectFactoryImpl } from '../../model/subjects/subject-factory-impl';
import { SubjectFactory } from '../../model/submission/subject-factory.interface';

export enum Services {
  EmitterFactory = 'EmitterFactory',
  ValidityReducer = 'ValidityReducer',
  ReducerFactory = 'ReducerFactory',
  SubjectFactory = 'SubjectFactory',
  ProxyProducerFactory = 'ProxyProducerFactory',
  AggregatorFactory = 'AggregatorFactory'
}

export function getTestContainer() {
  helpers.annotate(EmitterFactoryImpl);
  helpers.annotate(ValidityReducerImpl);
  helpers.annotate(ReducerFactoryImpl);
  helpers.annotate(SubjectFactoryImpl, [Services.EmitterFactory]);
  helpers.annotate(ProxyProducerFactoryImpl, [Services.ReducerFactory]);
  helpers.annotate(AggregatorFactoryImpl, [
    Services.ProxyProducerFactory,
    Services.ReducerFactory,
    Services.EmitterFactory,
    Services.SubjectFactory
  ]);

  const container = new Container();
  container
    .bind<EmitterFactory>(Services.EmitterFactory)
    .to(EmitterFactoryImpl)
    .inTransientScope();
  container
    .bind<ValidityReducer>(Services.ValidityReducer)
    .to(ValidityReducerImpl)
    .inTransientScope();
  container
    .bind<ReducerFactory>(Services.ReducerFactory)
    .to(ReducerFactoryImpl)
    .inSingletonScope();
  container
    .bind<SubjectFactory>(Services.SubjectFactory)
    .to(SubjectFactoryImpl)
    .inSingletonScope();
  container
    .bind<ProxyProducerFactory>(Services.ProxyProducerFactory)
    .to(ProxyProducerFactoryImpl)
    .inSingletonScope();
  container
    .bind<AggregatorFactory>(Services.AggregatorFactory)
    .to(AggregatorFactoryImpl)
    .inSingletonScope();
  return container;
}