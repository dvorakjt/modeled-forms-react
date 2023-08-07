import 'reflect-metadata';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import { EmitterFactoryImpl } from '../../model/constituents/emitters/event-emitter-factory-impl';
import { ValidityReducerImpl } from '../../model/constituents/reducers/validity-reducer-impl';
import { ReducerFactoryImpl } from '../../model/constituents/reducers/reducer-factory-impl';
import { ProxyProducerFactory } from '../../model/types/constituents/proxies/proxy-producer-factory.interface';
import { AggregatorFactoryImpl } from '../../model/constituents/aggregators/aggregator-factory-impl';
import type { EmitterFactory } from '../../model/types/constituents/emitters/emitter-factory.interface';
import type { ValidityReducer } from '../../model/types/constituents/reducers/validity-reducer.interface';
import type { ReducerFactory } from '../../model/types/constituents/reducers/reducer-factory.interface';
import type { AggregatorFactory } from '../../model/types/constituents/aggregators/aggregator-factory.interface';
import { ProxyProducerFactoryImpl } from '../../model/constituents/proxies/proxy-producer-factory-impl';
import { SubjectFactoryImpl } from '../../model/constituents/subjects/subject-factory-impl';
import { SubjectFactory } from '../../model/types/constituents/subjects/subject-factory.interface';

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