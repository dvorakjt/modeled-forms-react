import 'reflect-metadata';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import { FormElementRegistryImpl } from './constituents/form-elements/form-element-registry-impl';
import { SingleInputValidatorSuiteFactoryImpl } from './constituents/validators/single-input/single-input-validator-suite-factory-impl';
import { BaseFieldFactoryImpl } from './constituents/fields/base-field-factory-impl';
import { FormElementRegistry } from './types/constituents/form-elements/form-element-registry.interface';
import { SingleInputValidatorSuiteFactory } from './types/constituents/validators/single-input/single-input-validator-suite-factory.interface';
import { BaseFieldFactory } from './types/constituents/fields/base-field-factory.interface';
import { FormElementsParserImpl } from './parser/form-elements/form-elements-parser-impl';
import { FormElementsParser } from './types/parser/form-elements/form-elements-parser.interface';

export enum Services {
  FormElementRegistry = 'FormElementRegistry',
  SingleInputValidatorFactory = 'SingleInputValidatorFactory',
  BaseFieldFactory = 'BaseFieldFactory',
  FormElementsParser = 'FormElementsParser'
}

helpers.annotate(FormElementRegistryImpl);
helpers.annotate(SingleInputValidatorSuiteFactoryImpl);
helpers.annotate(BaseFieldFactoryImpl, [Services.SingleInputValidatorFactory]);
helpers.annotate(FormElementsParserImpl, [Services.BaseFieldFactory]);

export function getContainer() {
  const container = new Container();
  container
    .bind<FormElementRegistry>(Services.FormElementRegistry)
    .to(FormElementRegistryImpl)
    .inTransientScope();
  container
    .bind<SingleInputValidatorSuiteFactory>(Services.SingleInputValidatorFactory)
    .to(SingleInputValidatorSuiteFactoryImpl)
    .inSingletonScope();
  container
    .bind<BaseFieldFactory>(Services.BaseFieldFactory)
    .to(BaseFieldFactoryImpl)
    .inSingletonScope();
  container
    .bind<FormElementsParser>(Services.FormElementsParser)
    .to(FormElementsParserImpl)
    .inTransientScope();
  return container;
}