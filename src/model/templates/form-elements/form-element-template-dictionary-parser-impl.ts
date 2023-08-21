import { AbstractField } from '../../fields/base/abstract-field';
import { DualField } from '../../fields/base/dual-field';
import { FormElementDictionary } from '../../form-elements/form-element-dictionary.type';
import { FirstNonValidFormElementTracker } from '../../trackers/first-nonvalid-form-element-tracker.interface';
import { TrackerFactory, TrackerFactoryKey } from '../../trackers/tracker-factory.interface';
import { BaseFieldTemplateParser, BaseFieldTemplateParserKey } from '../fields/base/base-field-template-parser.interface';
import { ControlledFieldTemplateParser, ControlledFieldTemplateParserKey } from '../fields/controlled/controlled-field-template-parser.interface';
import { ControlledFieldTemplateVariations } from '../fields/controlled/controlled-field-template-variations.type';
import { NestedFormTemplateParser, NestedFormTemplateParserKey } from '../forms/nested-form-template-parser.interface';
import { FieldOrNestedFormTemplate } from './field-or-nested-form-template.type';
import { FormElementTemplateDictionaryOrMap } from './form-element-template-dictionary-or-map.type';
import {
  type FormElementTemplateDictionaryParser,
  type FormElementTemplateDictionaryParserKeyType,
  FormElementTemplateDictionaryParserKey,
} from './form-element-template-dictionary-parser.interface';
import { autowire } from 'undecorated-di';

class FormElementDictionaryParserImpl
  implements FormElementTemplateDictionaryParser
{
  #baseFieldTemplateParser: BaseFieldTemplateParser;
  #controlledFieldTemplateParser: ControlledFieldTemplateParser;
  #nestedFormTemplateParser: NestedFormTemplateParser;
  #trackerFactory: TrackerFactory;

  constructor(
    baseFieldTemplateParser: BaseFieldTemplateParser,
    controlledFieldTemplateParser: ControlledFieldTemplateParser,
    nestedFormTemplateParser: NestedFormTemplateParser,
    trackerFactory: TrackerFactory,
  ) {
    this.#baseFieldTemplateParser = baseFieldTemplateParser;
    this.#controlledFieldTemplateParser = controlledFieldTemplateParser;
    this.#nestedFormTemplateParser = nestedFormTemplateParser;
    this.#trackerFactory = trackerFactory;
  }

  parseTemplate(
    template: FormElementTemplateDictionaryOrMap,
  ): [FormElementDictionary, FirstNonValidFormElementTracker] {
    const formElementDictionary = {} as FormElementDictionary;
    const firstNonValidFormElementTracker =
      this.#trackerFactory.createFirstNonValidFormElementTracker();
    const controlledFields = new Set<string>();

    for (const [fieldName, formElementTemplate] of Object.entries(template)) {
      const formElement = this.isNestedForm(formElementTemplate)
        ? this.#nestedFormTemplateParser.parseTemplate(formElementTemplate)
        : this.#baseFieldTemplateParser.parseTemplate(formElementTemplate);
      formElementDictionary[fieldName] = formElement;

      firstNonValidFormElementTracker.trackFormElementValidity(
        fieldName,
        formElement,
      );

      if (this.isControlledField(formElementTemplate))
        controlledFields.add(fieldName);
    }

    for (const fieldName of controlledFields) {
      const formElementTemplate =
        template instanceof Map ? template.get(fieldName) : template[fieldName];

      formElementDictionary[fieldName] =
        this.#controlledFieldTemplateParser.parseTemplateAndDecorateField(
          formElementDictionary[fieldName] as AbstractField | DualField,
          formElementTemplate as ControlledFieldTemplateVariations,
          formElementDictionary,
        );
    }

    return [formElementDictionary, firstNonValidFormElementTracker];
  }

  private isNestedForm(template: FieldOrNestedFormTemplate) {
    return typeof template === 'object' && 'fields' in template;
  }

  private isControlledField(template: FieldOrNestedFormTemplate) {
    return (
      typeof template === 'object' &&
      ('asyncStateControlFn' in template ||
        'syncStateControlFn' in template ||
        'asyncValueControlFn' in template ||
        'syncValueControlFn' in template)
    );
  }
}

const FormElementTemplateDictionaryParserService = autowire<FormElementTemplateDictionaryParserKeyType, FormElementTemplateDictionaryParser, FormElementDictionaryParserImpl>(
  FormElementDictionaryParserImpl,
  FormElementTemplateDictionaryParserKey,
  [
    BaseFieldTemplateParserKey,
    ControlledFieldTemplateParserKey,
    NestedFormTemplateParserKey,
    TrackerFactoryKey
  ]
)

export { FormElementDictionaryParserImpl, FormElementTemplateDictionaryParserService };