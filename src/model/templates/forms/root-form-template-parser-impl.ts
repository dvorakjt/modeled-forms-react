import { autowire } from "undecorated-di";
import { AbstractRootForm } from "../../forms/abstract-root-form";
import { RootForm } from "../../forms/root-form";
import { SubmissionManagerFactory, SubmissionManagerFactoryKey } from "../../submission/submission-manager-factory.interface";
import { FinalizerTemplateDictionaryParser, FinalizerTemplateDictionaryParserKey } from "../finalizers/finalizer-template-dictionary-parser.interface";
import { FormElementTemplateDictionaryParser, FormElementTemplateDictionaryParserKey } from "../form-elements/form-element-template-dictionary-parser.interface";
import { MultiFieldValidatorsTemplateParser, MultiFieldValidatorsTemplateParserKey } from "../multi-field-validators/multi-field-validators-template-parser.interface";
import { RootFormTemplateParser, RootFormTemplateParserKey, RootFormTemplateParserKeyType } from "./root-form-template-parser.interface";
import { RootFormTemplate } from "./root-form-template.interface";

class RootFormTemplateParserImpl implements RootFormTemplateParser {
  #formElementTemplateDictionaryParser : FormElementTemplateDictionaryParser;
  #multiFieldValidatorsTemplateParser : MultiFieldValidatorsTemplateParser;
  #finalizerTemplateDictionaryParser : FinalizerTemplateDictionaryParser;
  #submissionManagerFactory : SubmissionManagerFactory;

  constructor(
    formElementTemplateDictionaryParser : FormElementTemplateDictionaryParser,
    multiFieldValidatorsTemplateParser : MultiFieldValidatorsTemplateParser,
    finalizerTemplateDictionaryParser : FinalizerTemplateDictionaryParser,
    submissionManagerFactory : SubmissionManagerFactory
  ) {
    this.#formElementTemplateDictionaryParser = formElementTemplateDictionaryParser;
    this.#multiFieldValidatorsTemplateParser = multiFieldValidatorsTemplateParser;
    this.#finalizerTemplateDictionaryParser = finalizerTemplateDictionaryParser;
    this.#submissionManagerFactory = submissionManagerFactory;
  }
  parseTemplate(template: RootFormTemplate): AbstractRootForm {
    const [baseFields, firstNonValidFormElementTracker] = this.#formElementTemplateDictionaryParser.parseTemplate(template.fields);
    const multiFieldValidatorsTemplate = template.multiFieldValidators ?? {};
    const [
      userFacingFields, 
      finalizerFacingFields,
      multiInputValidatorMessagesAggregator
    ] = this.#multiFieldValidatorsTemplateParser.parseTemplate(multiFieldValidatorsTemplate, baseFields);
    const finalizedFields = template.finalizedFields ?? {};
    const finalizerManager = this.#finalizerTemplateDictionaryParser.parseTemplate(finalizedFields, finalizerFacingFields);
    const submissionManager = this.#submissionManagerFactory.createSubmissionManager(template.submitFn);
    const form = new RootForm(userFacingFields, firstNonValidFormElementTracker, finalizerManager, multiInputValidatorMessagesAggregator, submissionManager);
    return form; //the new form part should come from a factory
  }
}

const RootFormTemplateParserService = autowire<RootFormTemplateParserKeyType, RootFormTemplateParser, RootFormTemplateParserImpl>(
  RootFormTemplateParserImpl,
  RootFormTemplateParserKey,
  [
    FormElementTemplateDictionaryParserKey,
    MultiFieldValidatorsTemplateParserKey,
    FinalizerTemplateDictionaryParserKey,
    SubmissionManagerFactoryKey
  ]
)

export { RootFormTemplateParserImpl, RootFormTemplateParserService };