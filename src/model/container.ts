import { ContainerBuilder } from 'undecorated-di';
import { AdapterFactoryService } from './adapters/adapter-factory-impl';
import { AggregatorFactoryService } from './aggregators/aggregator-factory-impl';
import { EmitterFactoryService } from './emitters/emitter-factory-impl';
import { BaseFieldFactoryService } from './fields/base/base-field-factory-impl';
import { ControlledFieldFactoryService } from './fields/controlled/controlled-field-factory-impl';
import { FinalizerFnFactoryService } from './finalizers/finalizer-functions/finalizer-fn-factory-impl';
import { FinalizerValidityTranslatorService } from './finalizers/finalizer-validity-translator-impl';
import { ProxyProducerFactoryService } from './proxies/proxy-producer-factory-impl';
import { ReducerFactoryService } from './reducers/reducer-factory-impl';
import { SubjectFactoryService } from './subjects/subject-factory-impl';
import { SingleInputValidatorSuiteFactoryService } from './validators/single-input/single-input-validator-suite-factory-impl';
import { InsertionOrderHeapFactoryService } from './insertion-order-heap/insertion-order-heap-factory-impl';
import { TrackerFactoryService } from './trackers/tracker-factory-impl';
import { MultiInputValidatorFactoryService } from './validators/multi-input/multi-input-validator-factory-impl';
import { MultiInputValidatedFormElementFactoryService } from './form-elements/multi-input-validated/multi-input-validated-form-element-factory-impl';
import { MultiFieldValidatorsTemplateParserService } from './templates/multi-field-validators/multi-field-validators-template-parser-impl';
import { FinalizerManagerFactoryService } from './finalizers/finalizer-manager-factory-impl';
import { FinalizerFactoryService } from './finalizers/finalizer-factory-impl';
import { SubmissionManagerFactoryService } from './submission/submission-manager-factory-impl';
import { NestedFormTemplateParserService } from './templates/forms/nested-form-template-parser-impl';
import { RootFormTemplateParserService } from './templates/forms/root-form-template-parser-impl';
import { FormElementTemplateDictionaryParserService } from './templates/form-elements/form-element-template-dictionary-parser-impl';
import { BaseFieldTemplateParserService } from './templates/fields/base/base-field-template-parser-impl';
import { ControlledFieldTemplateParserService } from './templates/fields/controlled/controlled-field-template-parser-impl';
import { FinalizerTemplateDictionaryParserService } from './templates/finalizers/finalizer-template-dictionary-parser-impl';
import { AutoTransformerService } from './auto-transforms/auto-transformer-impl';
import { AutoTransformedFieldFactoryService } from './fields/auto-transformed/auto-transformed-field-factory-impl';
import { ExtractedValuesTemplateParserService } from './templates/extracted-values/extracted-values-template-parser-impl';
import { ConfigLoaderService } from './config-loader/config-loader-impl';
import { ConfirmationManagerFactoryService } from './confirmation/confirmation-manager-factory-impl';

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
  .registerSingletonService(ConfigLoaderService)
  .registerSingletonService(ConfirmationManagerFactoryService)
  .build();

export { container };
