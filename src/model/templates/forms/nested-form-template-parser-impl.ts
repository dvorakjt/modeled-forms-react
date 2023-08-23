import { autowire } from "undecorated-di";
import { AbstractNestedForm } from "../../forms/abstract-nested-form";
import { NestedForm } from "../../forms/nested-form";
import { FinalizerTemplateDictionaryParser, FinalizerTemplateDictionaryParserKey } from "../finalizers/finalizer-template-dictionary-parser.interface";
import { FormElementTemplateDictionaryParser, FormElementTemplateDictionaryParserKey } from "../form-elements/form-element-template-dictionary-parser.interface";
import { MultiFieldValidatorsTemplateParser, MultiFieldValidatorsTemplateParserKey } from "../multi-field-validators/multi-field-validators-template-parser.interface";
import { NestedFormTemplateParser, NestedFormTemplateParserKey, NestedFormTemplateParserKeyType } from "./nested-form-template-parser.interface";
import { NestedFormTemplate } from "./nested-form-template.interface";

class NestedFormTemplateParserImpl implements NestedFormTemplateParser {
  #formElementTemplateDictionaryParser : FormElementTemplateDictionaryParser;
  #multiFieldValidatorsTemplateParser : MultiFieldValidatorsTemplateParser;
  #finalizerTemplateDictionaryParser : FinalizerTemplateDictionaryParser;

  constructor(
    formElementTemplateDictionaryParser : FormElementTemplateDictionaryParser,
    multiFieldValidatorsTemplateParser : MultiFieldValidatorsTemplateParser,
    finalizerTemplateDictionaryParser : FinalizerTemplateDictionaryParser,
  ) {
    this.#formElementTemplateDictionaryParser = formElementTemplateDictionaryParser;
    this.#multiFieldValidatorsTemplateParser = multiFieldValidatorsTemplateParser;
    this.#finalizerTemplateDictionaryParser = finalizerTemplateDictionaryParser;
  }
  parseTemplate(template: NestedFormTemplate): AbstractNestedForm {
    const [baseFields, firstNonValidFormElementTracker] = this.#formElementTemplateDictionaryParser.parseTemplate(template.fields);
    const multiFieldValidatorsTemplate = template.multiFieldValidators ?? {};
    const [
      userFacingFields, 
      finalizerFacingFields,
      multiInputValidatorMessagesAggregator
    ] = this.#multiFieldValidatorsTemplateParser.parseTemplate(multiFieldValidatorsTemplate, baseFields);
    const finalizedFields = template.finalizedFields ?? {};
    const finalizerManager = this.#finalizerTemplateDictionaryParser.parseTemplate(finalizedFields, finalizerFacingFields);
    const form = new NestedForm(userFacingFields, firstNonValidFormElementTracker, finalizerManager, multiInputValidatorMessagesAggregator, template.omitByDefault ?? false);
    return form; //the new form part should come from a factory
  }
}

const NestedFormTemplateParserService = autowire<NestedFormTemplateParserKeyType, NestedFormTemplateParser, NestedFormTemplateParserImpl>(
  NestedFormTemplateParserImpl,
  NestedFormTemplateParserKey,
  [
    FormElementTemplateDictionaryParserKey,
    MultiFieldValidatorsTemplateParserKey,
    FinalizerTemplateDictionaryParserKey
  ]
)

export { NestedFormTemplateParserImpl, NestedFormTemplateParserService }