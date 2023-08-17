import { ContainerBuilder } from 'undecorated-di';
import { AdapterFactoryService } from '../../model/adapters/adapter-factory-impl';
import { AggregatorFactoryService } from '../../model/aggregators/aggregator-factory-impl';
import { EmitterFactoryService } from '../../model/emitters/emitter-factory-impl';
import { BaseFieldFactoryService } from '../../model/fields/base/base-field-factory-impl';
import { ControlledFieldFactoryService } from '../../model/fields/controlled/controlled-field-factory-impl';
import { FinalizerFnFactoryService } from '../../model/finalizers/finalizer-functions/finalizer-fn-factory-impl';
import { FinalizerValidityTranslatorService } from '../../model/finalizers/finalizer-validity-translator-impl';
import { ProxyProducerFactoryService } from '../../model/proxies/proxy-producer-factory-impl';
import { ReducerFactoryService } from '../../model/reducers/reducer-factory-impl';
import { SubjectFactoryService } from '../../model/subjects/subject-factory-impl';
import { SingleInputValidatorSuiteFactoryService } from '../../model/validators/single-input/single-input-validator-suite-factory-impl';

export function getTestContainer() {
  const container = ContainerBuilder.createContainerBuilder()
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
