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

class RootFormTemplateParserImpl implements RootFormTemplateParser {
  _formElementTemplateDictionaryParser: FormElementTemplateDictionaryParser;
  _multiFieldValidatorsTemplateParser: MultiFieldValidatorsTemplateParser;
  _finalizerTemplateDictionaryParser: FinalizerTemplateDictionaryParser;
  _submissionManagerFactory: SubmissionManagerFactory;

  constructor(
    formElementTemplateDictionaryParser: FormElementTemplateDictionaryParser,
    multiFieldValidatorsTemplateParser: MultiFieldValidatorsTemplateParser,
    finalizerTemplateDictionaryParser: FinalizerTemplateDictionaryParser,
    submissionManagerFactory: SubmissionManagerFactory,
  ) {
    this._formElementTemplateDictionaryParser =
      formElementTemplateDictionaryParser;
    this._multiFieldValidatorsTemplateParser =
      multiFieldValidatorsTemplateParser;
    this._finalizerTemplateDictionaryParser = finalizerTemplateDictionaryParser;
    this._submissionManagerFactory = submissionManagerFactory;
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
    const submissionManager =
      this._submissionManagerFactory.createSubmissionManager(template.submitFn);
    const form = new RootForm(
      userFacingFields,
      firstNonValidFormElementTracker,
      finalizerManager,
      multiInputValidatorMessagesAggregator,
      submissionManager,
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
]);

export { RootFormTemplateParserImpl, RootFormTemplateParserService };
