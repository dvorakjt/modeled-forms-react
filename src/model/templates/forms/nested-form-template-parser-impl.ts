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

class NestedFormTemplateParserImpl implements NestedFormTemplateParser {
  _formElementTemplateDictionaryParser: FormElementTemplateDictionaryParser;
  _multiFieldValidatorsTemplateParser: MultiFieldValidatorsTemplateParser;
  _finalizerTemplateDictionaryParser: FinalizerTemplateDictionaryParser;

  constructor(
    formElementTemplateDictionaryParser: FormElementTemplateDictionaryParser,
    multiFieldValidatorsTemplateParser: MultiFieldValidatorsTemplateParser,
    finalizerTemplateDictionaryParser: FinalizerTemplateDictionaryParser,
  ) {
    this._formElementTemplateDictionaryParser =
      formElementTemplateDictionaryParser;
    this._multiFieldValidatorsTemplateParser =
      multiFieldValidatorsTemplateParser;
    this._finalizerTemplateDictionaryParser = finalizerTemplateDictionaryParser;
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
    const form = new NestedForm(
      userFacingFields,
      firstNonValidFormElementTracker,
      finalizerManager,
      multiInputValidatorMessagesAggregator,
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
]);

export { NestedFormTemplateParserImpl, NestedFormTemplateParserService };
