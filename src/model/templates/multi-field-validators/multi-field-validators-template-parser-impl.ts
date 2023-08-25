import { autowire } from "undecorated-di";
import { AggregatorFactory, AggregatorFactoryKey } from "../../aggregators/aggregator-factory.interface";
import { FormElementDictionary } from "../../form-elements/form-element-dictionary.type";
import { FinalizerFacingMultiInputValidatedFormElement } from "../../form-elements/multi-input-validated/finalizer-facing-multi-input-validated-form-element";
import { MultiInputValidatedFormElementFactory, MultiInputValidatedFormElementFactoryKey } from "../../form-elements/multi-input-validated/multi-input-validated-form-element-factory.interface";
import { UserFacingMultiInputValidatedDualField } from "../../form-elements/multi-input-validated/user-facing-multi-input-validated-dual-field";
import { UserFacingMultiInputValidatedField } from "../../form-elements/multi-input-validated/user-facing-multi-input-validated-field";
import { UserFacingMultiInputValidatedNestedForm } from "../../form-elements/multi-input-validated/user-facing-multi-input-validated-nested-form";
import { MultiInputValidatorFactory, MultiInputValidatorFactoryKey } from "../../validators/multi-input/multi-input-validator-factory.interface";
import { MultiInputValidator } from "../../validators/multi-input/multi-input-validator.interface";
import { MultiFieldValidatorsTemplateParser, MultiFieldValidatorsTemplateParserKey, MultiFieldValidatorsTemplateParserKeyType } from "./multi-field-validators-template-parser.interface";
import { MultiFieldValidatorsTemplate } from "./multi-field-validators-template.interface";
import { MultiInputValidatorMessagesAggregator } from "../../aggregators/multi-input-validator-messages-aggregator.interface";
import { config } from "../../../config";

type MultiInputValidatedFormElementDictionary = 
  Record<
    string,
    UserFacingMultiInputValidatedField | 
    UserFacingMultiInputValidatedDualField |
    UserFacingMultiInputValidatedNestedForm |
    FinalizerFacingMultiInputValidatedFormElement
  >;

class MultiFieldValidatorsTemplateParserImpl implements MultiFieldValidatorsTemplateParser {
  #multiInputValidatorFactory : MultiInputValidatorFactory;
  #multiInputValidatedFormElementFactory : MultiInputValidatedFormElementFactory;
  #aggregatorFactory : AggregatorFactory;

  constructor(
    multiInputValidatorFactory : MultiInputValidatorFactory,
    multiInputValidatedFormElementFactory : MultiInputValidatedFormElementFactory,
    aggregatorFactory : AggregatorFactory
  ) { 
    this.#multiInputValidatorFactory = multiInputValidatorFactory;
    this.#multiInputValidatedFormElementFactory = multiInputValidatedFormElementFactory;
    this.#aggregatorFactory = aggregatorFactory;
  }

  parseTemplate(template: MultiFieldValidatorsTemplate, formElementDictionary : FormElementDictionary): 
  [FormElementDictionary, FormElementDictionary, MultiInputValidatorMessagesAggregator] {
    const userFacingMultiInputValidatedFormElementDictionary = {} as MultiInputValidatedFormElementDictionary;
    const finalizerFacingMultiInputValidatedFormElementDictionary = {} as MultiInputValidatedFormElementDictionary;
    const validators : Array<MultiInputValidator> = [];

    template.sync?.forEach(validatorFn => {
      const multiInputValidator = this.#multiInputValidatorFactory.createSyncMultiInputValidator(validatorFn, formElementDictionary);
      multiInputValidator.accessedFields.onValue(this.onAccessedFields(userFacingMultiInputValidatedFormElementDictionary, finalizerFacingMultiInputValidatedFormElementDictionary, formElementDictionary, multiInputValidator));
      validators.push(multiInputValidator);
    });

    template.async?.forEach(validatorTemplate => {
      const multiInputValidator = this.#multiInputValidatorFactory.createAsyncMultiInputValidator(validatorTemplate.validatorFn, formElementDictionary, validatorTemplate.pendingValidatorMessage ?? config.globalMessages.pendingAsyncMultiFieldValidator);
      multiInputValidator.accessedFields.onValue(this.onAccessedFields(userFacingMultiInputValidatedFormElementDictionary, finalizerFacingMultiInputValidatedFormElementDictionary, formElementDictionary, multiInputValidator));
      validators.push(multiInputValidator);
    });

    const userFacingFormElementDictionary = userFacingMultiInputValidatedFormElementDictionary as FormElementDictionary;
    const finalizerFacingFormElementDictionary = finalizerFacingMultiInputValidatedFormElementDictionary as FormElementDictionary;

    for(const [fieldName, field] of Object.entries(formElementDictionary)) {
      if(!(fieldName in userFacingFormElementDictionary)) {
        userFacingFormElementDictionary[fieldName] = field;
        finalizerFacingFormElementDictionary[fieldName] = field;
      }
    }

    const multiInputValidatorMessagesAggregator = this.#aggregatorFactory.createMultiInputValidatorMessagesAggregatorFromValidators(validators);

    return [userFacingFormElementDictionary, finalizerFacingFormElementDictionary, multiInputValidatorMessagesAggregator];
  }
  
  private onAccessedFields(
    userFacingFormElementDictionary : MultiInputValidatedFormElementDictionary, 
    finalizerFacingFormElementDictionary : MultiInputValidatedFormElementDictionary,
    formElementDictionary : FormElementDictionary,
    validator : MultiInputValidator
  ) {
    return (accessedFields : Set<string>) => {
      accessedFields.forEach(fieldName => {
        if(!(fieldName in userFacingFormElementDictionary)) {
          const baseField = formElementDictionary[fieldName];
          const [userFacingField, finalizerFacingField] =
            this.#multiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(baseField);
          userFacingFormElementDictionary[fieldName] = userFacingField;
          finalizerFacingFormElementDictionary[fieldName] = finalizerFacingField;
        }
        userFacingFormElementDictionary[fieldName].addValidator(validator);
        finalizerFacingFormElementDictionary[fieldName].addValidator(validator);
      });
    }
  }
}

const MultiFieldValidatorsTemplateParserService = autowire<MultiFieldValidatorsTemplateParserKeyType, MultiFieldValidatorsTemplateParser, MultiFieldValidatorsTemplateParserImpl>(
  MultiFieldValidatorsTemplateParserImpl,
  MultiFieldValidatorsTemplateParserKey,
  [
    MultiInputValidatorFactoryKey,
    MultiInputValidatedFormElementFactoryKey,
    AggregatorFactoryKey
  ]
)

export { MultiFieldValidatorsTemplateParserImpl, MultiFieldValidatorsTemplateParserService };