import 'reflect-metadata';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import { SingleInputValidatorSuiteFactoryImpl } from './constituents/validators/single-input/single-input-validator-suite-factory-impl';
import { BaseFieldFactoryImpl } from './constituents/fields/base-field-factory-impl';
import { SingleInputValidatorSuiteFactory } from './types/constituents/validators/single-input/single-input-validator-suite-factory.interface';
import { BaseFieldFactory } from './types/constituents/fields/base-field-factory.interface';
import { FormElementsParserImpl } from './parser/form-elements/form-elements-parser-impl';
import { FormElementsParser } from './types/parser/form-elements/form-elements-parser.interface';
import { AggregatorFactory } from './types/constituents/aggregators/aggregator-factory.interface';
import { AggregatorFactoryImpl } from './constituents/aggregators/aggregator-factory-impl';
import { ReducerFactoryImpl } from './constituents/reducers/reducer-factory-impl';
import { ProxyProducerFactoryImpl } from './constituents/proxies/proxy-producer-factory-impl';
import { EmitterFactoryImpl } from './constituents/emitters/event-emitter-factory-impl';
import { SubjectFactoryImpl } from './constituents/subjects/subject-factory-impl';
import { AdapterFactoryImpl } from './constituents/adapters/adapter-factory-impl';
import { ControlledFieldFactoryImpl } from './constituents/fields/controlled-field-factory-impl';
import { ReducerFactory } from './types/constituents/reducers/reducer-factory.interface';
import { EmitterFactory } from './types/constituents/emitters/emitter-factory.interface';
import { SubjectFactory } from './types/constituents/subjects/subject-factory.interface';
import { ProxyProducerFactory } from './types/constituents/proxies/proxy-producer-factory.interface';
import { AdapterFactory } from './types/constituents/adapters/adapter-factory.interface';
import { ControlledFieldFactory } from './types/constituents/fields/controlled-field-factory.interface';

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
  FormElementsParser = 'FormElementsParser'
}

helpers.annotate(SingleInputValidatorSuiteFactoryImpl);
helpers.annotate(ReducerFactoryImpl);
helpers.annotate(EmitterFactoryImpl);
helpers.annotate(SubjectFactoryImpl, [Services.EmitterFactory]);
helpers.annotate(ProxyProducerFactoryImpl, [Services.ReducerFactory]);
helpers.annotate(BaseFieldFactoryImpl, [Services.SingleInputValidatorFactory]);
helpers.annotate(AggregatorFactoryImpl, [Services.ProxyProducerFactory, Services.ReducerFactory, Services.EmitterFactory, Services.SubjectFactory]);
helpers.annotate(AdapterFactoryImpl, [Services.AggregatorFactory]);
helpers.annotate(ControlledFieldFactoryImpl, [Services.AdapterFactory]);
helpers.annotate(FormElementsParserImpl, [Services.BaseFieldFactory, Services.ControlledFieldFactory]);

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
  container
    .bind<FormElementsParser>(Services.FormElementsParser)
    .to(FormElementsParserImpl)
    .inTransientScope();
  return container;
}