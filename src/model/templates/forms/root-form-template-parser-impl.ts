import { autowire } from 'undecorated-di';
import { AbstractRootForm } from '../../forms/abstract-root-form';
import { RootForm } from '../../forms/root-form';
import {
  SubmissionManagerFactory,
  SubmissionManagerFactoryKey,
} from '../../submission/submission-manager-factory.interface';
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
  RootFormTemplateParser,
  RootFormTemplateParserKey,
  RootFormTemplateParserKeyType,
} from './root-form-template-parser.interface';
import { RootFormTemplate } from './root-form-template.interface';
import { ExtractedValuesTemplateParser, ExtractedValuesTemplateParserKey } from '../extracted-values/extracted-values-template-parser.interface';
import { ConfirmationManagerFactory, ConfirmationManagerFactoryKey } from '../../confirmation/confirmation-manager-factory.interface';

class RootFormTemplateParserImpl implements RootFormTemplateParser {
  _formElementTemplateDictionaryParser: FormElementTemplateDictionaryParser;
  _multiFieldValidatorsTemplateParser: MultiFieldValidatorsTemplateParser;
  _finalizerTemplateDictionaryParser: FinalizerTemplateDictionaryParser;
  _submissionManagerFactory: SubmissionManagerFactory;
  _extractedValuesTemplateParser : ExtractedValuesTemplateParser;
  _confirmationManagerFactory : ConfirmationManagerFactory;

  constructor(
    formElementTemplateDictionaryParser: FormElementTemplateDictionaryParser,
    multiFieldValidatorsTemplateParser: MultiFieldValidatorsTemplateParser,
    finalizerTemplateDictionaryParser: FinalizerTemplateDictionaryParser,
    submissionManagerFactory: SubmissionManagerFactory,
    extractedValuesTemplateParser : ExtractedValuesTemplateParser,
    confirmationManagerFactory : ConfirmationManagerFactory
  ) {
    this._formElementTemplateDictionaryParser =
      formElementTemplateDictionaryParser;
    this._multiFieldValidatorsTemplateParser =
      multiFieldValidatorsTemplateParser;
    this._finalizerTemplateDictionaryParser = finalizerTemplateDictionaryParser;
    this._submissionManagerFactory = submissionManagerFactory;
    this._extractedValuesTemplateParser = extractedValuesTemplateParser;
    this._confirmationManagerFactory = confirmationManagerFactory;
  }
  parseTemplate(template: RootFormTemplate): AbstractRootForm {
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

    const confirmationManager = this._confirmationManagerFactory.createConfirmationManager();

    const submissionManager =
      this._submissionManagerFactory.createSubmissionManager(template.submitFn);

    const extractedValues = this._extractedValuesTemplateParser.parseTemplate(template.extractedValues
      ?? {
        syncExtractedValues : {},
        asyncExtractedValues : {}
      }, finalizerFacingFields);

    const form = new RootForm(
      userFacingFields,
      extractedValues,
      firstNonValidFormElementTracker,
      finalizerManager,
      multiInputValidatorMessagesAggregator,
      confirmationManager,
      submissionManager
    );
    
    return form; //the new form part should come from a factory
  }
}

const RootFormTemplateParserService = autowire<
  RootFormTemplateParserKeyType,
  RootFormTemplateParser,
  RootFormTemplateParserImpl
>(RootFormTemplateParserImpl, RootFormTemplateParserKey, [
  FormElementTemplateDictionaryParserKey,
  MultiFieldValidatorsTemplateParserKey,
  FinalizerTemplateDictionaryParserKey,
  SubmissionManagerFactoryKey,
  ExtractedValuesTemplateParserKey,
  ConfirmationManagerFactoryKey
]);

export { RootFormTemplateParserImpl, RootFormTemplateParserService };
