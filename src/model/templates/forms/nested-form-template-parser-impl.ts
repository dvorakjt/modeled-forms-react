import { autowire } from 'undecorated-di';
import { AbstractNestedForm } from '../../forms/abstract-nested-form';
import { NestedForm } from '../../forms/nested-form';
import {
  FinalizerTemplateDictionaryParser,
  FinalizerTemplateDictionaryParserKey,
} from '../finalizers/finalizer-template-dictionary-parser.interface';
import {
  FormElementTemplateDictionaryParser,
  FormElementTemplateDictionaryParserKey,
} from '../form-elements/form-element-template-dictionary-parser.interface';
import {
  MultiFieldValidatorsTemplateParser,
  MultiFieldValidatorsTemplateParserKey,
} from '../multi-field-validators/multi-field-validators-template-parser.interface';
import {
  NestedFormTemplateParser,
  NestedFormTemplateParserKey,
  NestedFormTemplateParserKeyType,
} from './nested-form-template-parser.interface';
import { NestedFormTemplate } from './nested-form-template.interface';
import {
  ExtractedValuesTemplateParser,
  ExtractedValuesTemplateParserKey,
} from '../extracted-values/extracted-values-template-parser.interface';
import {
  ConfirmationManagerFactory,
  ConfirmationManagerFactoryKey,
} from '../../confirmation/confirmation-manager-factory.interface';

class NestedFormTemplateParserImpl implements NestedFormTemplateParser {
  _formElementTemplateDictionaryParser: FormElementTemplateDictionaryParser;
  _multiFieldValidatorsTemplateParser: MultiFieldValidatorsTemplateParser;
  _finalizerTemplateDictionaryParser: FinalizerTemplateDictionaryParser;
  _extractedValuesTemplateParser: ExtractedValuesTemplateParser;
  _confirmationManagerFactory: ConfirmationManagerFactory;

  constructor(
    formElementTemplateDictionaryParser: FormElementTemplateDictionaryParser,
    multiFieldValidatorsTemplateParser: MultiFieldValidatorsTemplateParser,
    finalizerTemplateDictionaryParser: FinalizerTemplateDictionaryParser,
    extractedValuesTemplate: ExtractedValuesTemplateParser,
    confirmationManagerFactory: ConfirmationManagerFactory,
  ) {
    this._formElementTemplateDictionaryParser =
      formElementTemplateDictionaryParser;
    this._multiFieldValidatorsTemplateParser =
      multiFieldValidatorsTemplateParser;
    this._finalizerTemplateDictionaryParser = finalizerTemplateDictionaryParser;
    this._extractedValuesTemplateParser = extractedValuesTemplate;
    this._confirmationManagerFactory = confirmationManagerFactory;
  }
  parseTemplate(template: NestedFormTemplate): AbstractNestedForm {
    const [baseFields, firstNonValidFormElementTracker] =
      this._formElementTemplateDictionaryParser.parseTemplate(template.fields);

    const multiFieldValidatorsTemplate = template.multiFieldValidators ?? {};

    const [
      userFacingFields,
      finalizerFacingFields,
      multiInputValidatorMessagesAggregator,
    ] = this._multiFieldValidatorsTemplateParser.parseTemplate(
      multiFieldValidatorsTemplate,
      baseFields,
    );

    const finalizedFields = template.finalizedFields ?? {};

    const finalizerManager =
      this._finalizerTemplateDictionaryParser.parseTemplate(
        finalizedFields,
        finalizerFacingFields,
      );

    const extractedValues = this._extractedValuesTemplateParser.parseTemplate(
      template.extractedValues ?? {
        syncExtractedValues: {},
        asyncExtractedValues: {},
      },
      finalizerFacingFields,
    );

    const confirmationManager =
      this._confirmationManagerFactory.createConfirmationManager();

    const form = new NestedForm(
      userFacingFields,
      extractedValues,
      firstNonValidFormElementTracker,
      finalizerManager,
      multiInputValidatorMessagesAggregator,
      confirmationManager,
      template.omitByDefault ?? false,
    );

    return form; //the new form part should come from a factory
  }
}

const NestedFormTemplateParserService = autowire<
  NestedFormTemplateParserKeyType,
  NestedFormTemplateParser,
  NestedFormTemplateParserImpl
>(NestedFormTemplateParserImpl, NestedFormTemplateParserKey, [
  FormElementTemplateDictionaryParserKey,
  MultiFieldValidatorsTemplateParserKey,
  FinalizerTemplateDictionaryParserKey,
  ExtractedValuesTemplateParserKey,
  ConfirmationManagerFactoryKey,
]);

export { NestedFormTemplateParserImpl, NestedFormTemplateParserService };
