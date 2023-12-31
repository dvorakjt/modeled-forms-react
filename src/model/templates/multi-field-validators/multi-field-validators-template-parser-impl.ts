import { autowire } from 'undecorated-di';
import {
  AggregatorFactory,
  AggregatorFactoryKey,
} from '../../aggregators/aggregator-factory.interface';
import { FormElementDictionary } from '../../form-elements/form-element-dictionary.type';
import { FinalizerFacingMultiInputValidatedFormElement } from '../../form-elements/multi-input-validated/finalizer-facing-multi-input-validated-form-element';
import {
  MultiInputValidatedFormElementFactory,
  MultiInputValidatedFormElementFactoryKey,
} from '../../form-elements/multi-input-validated/multi-input-validated-form-element-factory.interface';
import { UserFacingMultiInputValidatedDualField } from '../../form-elements/multi-input-validated/user-facing-multi-input-validated-dual-field';
import { UserFacingMultiInputValidatedField } from '../../form-elements/multi-input-validated/user-facing-multi-input-validated-field';
import { UserFacingMultiInputValidatedNestedForm } from '../../form-elements/multi-input-validated/user-facing-multi-input-validated-nested-form';
import {
  MultiInputValidatorFactory,
  MultiInputValidatorFactoryKey,
} from '../../validators/multi-input/multi-input-validator-factory.interface';
import { MultiInputValidator } from '../../validators/multi-input/multi-input-validator.interface';
import {
  MultiFieldValidatorsTemplateParser,
  MultiFieldValidatorsTemplateParserKey,
  MultiFieldValidatorsTemplateParserKeyType,
} from './multi-field-validators-template-parser.interface';
import { MultiFieldValidatorsTemplate } from './multi-field-validators-template.interface';
import { MultiInputValidatorMessagesAggregator } from '../../aggregators/multi-input-validator-messages-aggregator.interface';
import { AbstractField } from '../../fields/base/abstract-field';
import {
  AutoTransformedFieldFactory,
  AutoTransformedFieldFactoryKey,
} from '../../fields/auto-transformed/auto-transformed-field-factory.interface';
import { ConfigLoader, ConfigLoaderKey } from '../../config-loader/config-loader.interface';

type MultiInputValidatedFormElementDictionary = Record<
  string,
  | UserFacingMultiInputValidatedField
  | UserFacingMultiInputValidatedDualField
  | UserFacingMultiInputValidatedNestedForm
  | FinalizerFacingMultiInputValidatedFormElement
>;

class MultiFieldValidatorsTemplateParserImpl
  implements MultiFieldValidatorsTemplateParser
{
  _multiInputValidatorFactory: MultiInputValidatorFactory;
  _multiInputValidatedFormElementFactory: MultiInputValidatedFormElementFactory;
  _aggregatorFactory: AggregatorFactory;
  _autoTransformedFieldFactory: AutoTransformedFieldFactory;
  _configLoader : ConfigLoader;

  constructor(
    multiInputValidatorFactory: MultiInputValidatorFactory,
    multiInputValidatedFormElementFactory: MultiInputValidatedFormElementFactory,
    aggregatorFactory: AggregatorFactory,
    autoTransformedFieldFactory: AutoTransformedFieldFactory,
    configLoader : ConfigLoader
  ) {
    this._multiInputValidatorFactory = multiInputValidatorFactory;
    this._multiInputValidatedFormElementFactory =
      multiInputValidatedFormElementFactory;
    this._aggregatorFactory = aggregatorFactory;
    this._autoTransformedFieldFactory = autoTransformedFieldFactory;
    this._configLoader = configLoader;
  }

  parseTemplate(
    template: MultiFieldValidatorsTemplate,
    formElementDictionary: FormElementDictionary,
  ): [
    FormElementDictionary,
    FormElementDictionary,
    MultiInputValidatorMessagesAggregator,
  ] {
    const userFacingMultiInputValidatedFormElementDictionary =
      {} as MultiInputValidatedFormElementDictionary;
    const finalizerFacingMultiInputValidatedFormElementDictionary =
      {} as MultiInputValidatedFormElementDictionary;
    const validators: Array<MultiInputValidator> = [];

    template.sync?.forEach(validatorFn => {
      const multiInputValidator =
        this._multiInputValidatorFactory.createSyncMultiInputValidator(
          validatorFn,
          formElementDictionary,
        );
      multiInputValidator.accessedFields.onValue(
        this._onAccessedFields(
          userFacingMultiInputValidatedFormElementDictionary,
          finalizerFacingMultiInputValidatedFormElementDictionary,
          formElementDictionary,
          multiInputValidator,
        ),
      );
      validators.push(multiInputValidator);
    });

    template.async?.forEach(validatorTemplate => {
      const multiInputValidator =
        this._multiInputValidatorFactory.createAsyncMultiInputValidator(
          validatorTemplate.validatorFn,
          formElementDictionary,
          validatorTemplate.pendingValidatorMessage ??
            this._configLoader.config.globalMessages.pendingAsyncMultiFieldValidator,
        );
      multiInputValidator.accessedFields.onValue(
        this._onAccessedFields(
          userFacingMultiInputValidatedFormElementDictionary,
          finalizerFacingMultiInputValidatedFormElementDictionary,
          formElementDictionary,
          multiInputValidator,
        ),
      );
      validators.push(multiInputValidator);
    });

    const userFacingFormElementDictionary =
      userFacingMultiInputValidatedFormElementDictionary as FormElementDictionary;
    const finalizerFacingFormElementDictionary =
      finalizerFacingMultiInputValidatedFormElementDictionary as FormElementDictionary;

    for (const [fieldName, field] of Object.entries(formElementDictionary)) {
      if (!(fieldName in userFacingFormElementDictionary)) {
        userFacingFormElementDictionary[fieldName] = field;
        finalizerFacingFormElementDictionary[fieldName] = field;
      }
    }

    //decorate finalizer facing fields with auto transformed fields
    for (const [fieldName, field] of Object.entries(
      finalizerFacingFormElementDictionary,
    )) {
      if (userFacingFormElementDictionary[fieldName] instanceof AbstractField) {
        finalizerFacingFormElementDictionary[fieldName] =
          this._autoTransformedFieldFactory.createAutoTransformedField(
            field as AbstractField,
          );
      }
    }

    const multiInputValidatorMessagesAggregator =
      this._aggregatorFactory.createMultiInputValidatorMessagesAggregatorFromValidators(
        validators,
      );

    return [
      userFacingFormElementDictionary,
      finalizerFacingFormElementDictionary,
      multiInputValidatorMessagesAggregator,
    ];
  }

  _onAccessedFields(
    userFacingFormElementDictionary: MultiInputValidatedFormElementDictionary,
    finalizerFacingFormElementDictionary: MultiInputValidatedFormElementDictionary,
    formElementDictionary: FormElementDictionary,
    validator: MultiInputValidator,
  ) {
    return (accessedFields: Set<string>) => {
      accessedFields.forEach(fieldName => {
        if (!(fieldName in userFacingFormElementDictionary)) {
          const baseField = formElementDictionary[fieldName];
          const [userFacingField, finalizerFacingField] =
            this._multiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
              baseField,
            );
          userFacingFormElementDictionary[fieldName] = userFacingField;
          finalizerFacingFormElementDictionary[fieldName] =
            finalizerFacingField;
        }
        userFacingFormElementDictionary[fieldName].addValidator(validator);
        finalizerFacingFormElementDictionary[fieldName].addValidator(validator);
      });
    };
  }
}

const MultiFieldValidatorsTemplateParserService = autowire<
  MultiFieldValidatorsTemplateParserKeyType,
  MultiFieldValidatorsTemplateParser,
  MultiFieldValidatorsTemplateParserImpl
>(
  MultiFieldValidatorsTemplateParserImpl,
  MultiFieldValidatorsTemplateParserKey,
  [
    MultiInputValidatorFactoryKey,
    MultiInputValidatedFormElementFactoryKey,
    AggregatorFactoryKey,
    AutoTransformedFieldFactoryKey,
    ConfigLoaderKey
  ],
);

export {
  MultiFieldValidatorsTemplateParserImpl,
  MultiFieldValidatorsTemplateParserService,
};
