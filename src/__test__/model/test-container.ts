import { ContainerBuilder } from 'undecorated-di';
import AdapterFactoryService from '../../../src/model/adapters/adapter-factory-impl';
import AggregatorFactoryService from '../../../src/model/aggregators/aggregator-factory-impl';
import EmitterFactoryService from '../../../src/model/emitters/emitter-factory-impl';
import BaseFieldFactoryService from '../../../src/model/fields/base/base-field-factory-impl';
import ControlledFieldFactoryService from '../../../src/model/fields/controlled/controlled-field-factory-impl';
import FinalizerFnFactoryService from '../../../src/model/finalizers/finalizer-functions/finalizer-fn-factory-impl';
import FinalizerValidityTranslatorService from '../../../src/model/finalizers/finalizer-validity-translator-impl';
import ProxyProducerFactoryService from '../../../src/model/proxies/proxy-producer-factory-impl';
import ReducerFactoryService from '../../../src/model/reducers/reducer-factory-impl';
import SubjectFactoryService from '../../../src/model/subjects/subject-factory-impl';
import SingleInputValidatorSuiteFactoryService from '../../../src/model/validators/single-input/single-input-validator-suite-factory-impl';

export function getTestContainer() {
  const container = ContainerBuilder
    .createContainerBuilder()
    .registerSingletonService(AdapterFactoryService)
    .registerSingletonService(AggregatorFactoryService)
    .registerSingletonService(EmitterFactoryService)
    .registerSingletonService(BaseFieldFactoryService)
    .registerSingletonService(ControlledFieldFactoryService)
    .registerSingletonService(FinalizerFnFactoryService)
    .registerSingletonService(FinalizerValidityTranslatorService)
    .registerSingletonService(ProxyProducerFactoryService)
    .registerSingletonService(ReducerFactoryService)
    .registerSingletonService(SubjectFactoryService)
    .registerSingletonService(SingleInputValidatorSuiteFactoryService)
    .build();
  return container;
}