import 'reflect-metadata';
import { Container } from 'inversify';
import { SingleInputValidatorSuiteFactoryImpl } from './validators/single-input/single-input-validator-suite-factory-impl';
import { BaseFieldFactoryImpl } from './fields/base/base-field-factory-impl';
import { SingleInputValidatorSuiteFactory } from './validators/single-input/single-input-validator-suite-factory.interface';
import { BaseFieldFactory } from './fields/base/base-field-factory.interface';
import { AggregatorFactory } from './aggregators/aggregator-factory.interface';
import { AggregatorFactoryImpl } from './aggregators/aggregator-factory-impl';
import { ReducerFactoryImpl } from './reducers/reducer-factory-impl';
import { ProxyProducerFactoryImpl } from './proxies/proxy-producer-factory-impl';
import { EmitterFactoryImpl } from './emitters/emitter-factory-impl';
import { SubjectFactoryImpl } from './subjects/subject-factory-impl';
import { AdapterFactoryImpl } from './adapters/adapter-factory-impl';
import { ControlledFieldFactoryImpl } from './fields/controlled/controlled-field-factory-impl';
import { ReducerFactory } from './reducers/reducer-factory.interface';
import { EmitterFactory } from './emitters/emitter-factory.interface';
import { SubjectFactory } from './subjects/subject-factory.interface';
import { ProxyProducerFactory } from './proxies/proxy-producer-factory.interface';
import { AdapterFactory } from './adapters/adapter-factory.interface';
import { ControlledFieldFactory } from './fields/controlled/controlled-field-factory.interface';

export enum Services {
  SingleInputValidatorFactory = 'SingleInputValidatorFactory',
  BaseFieldFactory = 'BaseFieldFactory',
  ProxyProducerFactory = 'ProxyProducerFactory',
  ReducerFactory = 'ReducerFactory',
  EmitterFactory = 'EmitterFactory',
  SubjectFactory = 'SubjectFactory',
  AggregatorFactory = 'AggregatorFactory',
  AdapterFactory = 'AdapterFactory',
  ControlledFieldFactory = 'ControlledFieldFactory',
}

//these are almost all factories. can probably be bound in singleton scope, and just export the parser!
export function getContainer() {
  const container = new Container();
  container
    .bind<SingleInputValidatorSuiteFactory>(Services.SingleInputValidatorFactory)
    .to(SingleInputValidatorSuiteFactoryImpl)
    .inSingletonScope();
  container
    .bind<BaseFieldFactory>(Services.BaseFieldFactory)
    .to(BaseFieldFactoryImpl)
    .inSingletonScope();
  container
    .bind<ReducerFactory>(Services.ReducerFactory)
    .to(ReducerFactoryImpl)
    .inSingletonScope();
  container
    .bind<EmitterFactory>(Services.EmitterFactory)
    .to(EmitterFactoryImpl)
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
  container
    .bind<AdapterFactory>(Services.AdapterFactory)
    .to(AdapterFactoryImpl)
    .inSingletonScope();
  container
    .bind<ControlledFieldFactory>(Services.ControlledFieldFactory)
    .to(ControlledFieldFactoryImpl)
    .inSingletonScope();
  return container;
}