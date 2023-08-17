import { ContainerBuilder } from 'undecorated-di';
import AdapterFactoryService from './adapters/adapter-factory-impl';
import AggregatorFactoryService from './aggregators/aggregator-factory-impl';
import EmitterFactoryService from './emitters/emitter-factory-impl';
import BaseFieldFactoryService from './fields/base/base-field-factory-impl';
import ControlledFieldFactoryService from './fields/controlled/controlled-field-factory-impl';
import FinalizerFnFactoryService from './finalizers/finalizer-functions/finalizer-fn-factory-impl';
import FinalizerValidityTranslatorService from './finalizers/finalizer-validity-translator-impl';
import ProxyProducerFactoryService from './proxies/proxy-producer-factory-impl';
import ReducerFactoryService from './reducers/reducer-factory-impl';
import SubjectFactoryService from './subjects/subject-factory-impl';
import SingleInputValidatorSuiteFactoryService from './validators/single-input/single-input-validator-suite-factory-impl';
import InsertionOrderHeapFactoryService from './insertion-order-heap/insertion-order-heap-factory-impl';
import TrackerFactoryService from './trackers/tracker-factory-impl';

export const container = ContainerBuilder
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
  .registerSingletonService(InsertionOrderHeapFactoryService)
  .registerSingletonService(TrackerFactoryService)
  .build();