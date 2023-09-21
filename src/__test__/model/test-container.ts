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
import { BaseFieldTemplateParserService } from '../../model/templates/fields/base/base-field-template-parser-impl';
import { ControlledFieldTemplateParserService } from '../../model/templates/fields/controlled/controlled-field-template-parser-impl';
import { InsertionOrderHeapFactoryService } from '../../model/insertion-order-heap/insertion-order-heap-factory-impl';
import { TrackerFactoryService } from '../../model/trackers/tracker-factory-impl';
import { MultiInputValidatorFactoryService } from '../../model/validators/multi-input/multi-input-validator-factory-impl';
import { MultiInputValidatedFormElementFactoryService } from '../../model/form-elements/multi-input-validated/multi-input-validated-form-element-factory-impl';
import { MultiFieldValidatorsTemplateParserService } from '../../model/templates/multi-field-validators/multi-field-validators-template-parser-impl';
import { FinalizerFactoryService } from '../../model/finalizers/finalizer-factory-impl';
import { FinalizerManagerFactoryService } from '../../model/finalizers/finalizer-manager-factory-impl';
import { FinalizerTemplateDictionaryParserService } from '../../model/templates/finalizers/finalizer-template-dictionary-parser-impl';
import { SubmissionManagerFactoryService } from '../../model/submission/submission-manager-factory-impl';
import { FormElementTemplateDictionaryParserService } from '../../model/templates/form-elements/form-element-template-dictionary-parser-impl';
import { NestedFormTemplateParserService } from '../../model/templates/forms/nested-form-template-parser-impl';
import { RootFormTemplateParserService } from '../../model/templates/forms/root-form-template-parser-impl';
import { AutoTransformerService } from '../../model/auto-transforms/auto-transformer-impl';
import { AutoTransformedFieldFactoryService } from '../../model/fields/auto-transformed/auto-transformed-field-factory-impl';
import { ExtractedValuesTemplateParserService } from '../../model/templates/extracted-values/extracted-values-template-parser-impl';

export function getTestContainer() {
  const container = ContainerBuilder.createContainerBuilder()
    .registerSingletonService(AdapterFactoryService)
    .registerSingletonService(AggregatorFactoryService)
    .registerSingletonService(EmitterFactoryService)
    .registerSingletonService(BaseFieldFactoryService)
    .registerSingletonService(BaseFieldTemplateParserService)
    .registerSingletonService(ControlledFieldTemplateParserService)
    .registerSingletonService(ControlledFieldFactoryService)
    .registerSingletonService(ProxyProducerFactoryService)
    .registerSingletonService(ReducerFactoryService)
    .registerSingletonService(SubjectFactoryService)
    .registerSingletonService(SingleInputValidatorSuiteFactoryService)
    .registerSingletonService(InsertionOrderHeapFactoryService)
    .registerSingletonService(TrackerFactoryService)
    .registerSingletonService(MultiInputValidatorFactoryService)
    .registerSingletonService(MultiInputValidatedFormElementFactoryService)
    .registerSingletonService(MultiFieldValidatorsTemplateParserService)
    .registerSingletonService(FinalizerFnFactoryService)
    .registerSingletonService(FinalizerValidityTranslatorService)
    .registerSingletonService(FinalizerFactoryService)
    .registerSingletonService(FinalizerManagerFactoryService)
    .registerSingletonService(FinalizerTemplateDictionaryParserService)
    .registerSingletonService(SubmissionManagerFactoryService)
    .registerSingletonService(FormElementTemplateDictionaryParserService)
    .registerSingletonService(NestedFormTemplateParserService)
    .registerSingletonService(RootFormTemplateParserService)
    .registerSingletonService(AutoTransformerService)
    .registerSingletonService(AutoTransformedFieldFactoryService)
    .registerSingletonService(ExtractedValuesTemplateParserService)
    .build();
  return container;
}
