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
    console.log('1')
    const multiFieldValidatorsTemplate = template.multiFieldValidators ?? {};
    const [
      userFacingFields, 
      finalizerFacingFields,
      multiInputValidatorMessagesAggregator
    ] = this.#multiFieldValidatorsTemplateParser.parseTemplate(multiFieldValidatorsTemplate, baseFields);
    console.log('2')
    const finalizerTemplateDictionary = template.finalizerTemplateDictionary ?? {};
    const finalizerManager = this.#finalizerTemplateDictionaryParser.parseTemplate(finalizerTemplateDictionary, finalizerFacingFields);
    console.log('3')
    const submissionManager = this.#submissionManagerFactory.createSubmissionManager(template.submitFn);
    console.log('4')
    const form = new RootForm(userFacingFields, firstNonValidFormElementTracker, finalizerManager, multiInputValidatorMessagesAggregator, submissionManager);
    console.log('5')
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