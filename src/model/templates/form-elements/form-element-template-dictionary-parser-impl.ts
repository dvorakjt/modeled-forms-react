import { AbstractField } from '../../fields/base/abstract-field';
import { DualField } from '../../fields/base/dual-field';
import { FormElementDictionary } from '../../form-elements/form-element-dictionary.type';
import { FirstNonValidFormElementTracker } from '../../trackers/first-nonvalid-form-element-tracker.interface';
import {
  TrackerFactory,
  TrackerFactoryKey,
} from '../../trackers/tracker-factory.interface';
import {
  BaseFieldTemplateParser,
  BaseFieldTemplateParserKey,
} from '../fields/base/base-field-template-parser.interface';
import {
  ControlledFieldTemplateParser,
  ControlledFieldTemplateParserKey,
} from '../fields/controlled/controlled-field-template-parser.interface';
import { ControlledFieldTemplateVariations } from '../fields/controlled/controlled-field-template-variations.type';
import {
  NestedFormTemplateParser,
  NestedFormTemplateParserKey,
} from '../forms/nested-form-template-parser.interface';
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
  _baseFieldTemplateParser: BaseFieldTemplateParser;
  _controlledFieldTemplateParser: ControlledFieldTemplateParser;
  _nestedFormTemplateParser: NestedFormTemplateParser;
  _trackerFactory: TrackerFactory;

  constructor(
    baseFieldTemplateParser: BaseFieldTemplateParser,
    controlledFieldTemplateParser: ControlledFieldTemplateParser,
    nestedFormTemplateParser: NestedFormTemplateParser,
    trackerFactory: TrackerFactory,
  ) {
    this._baseFieldTemplateParser = baseFieldTemplateParser;
    this._controlledFieldTemplateParser = controlledFieldTemplateParser;
    this._nestedFormTemplateParser = nestedFormTemplateParser;
    this._trackerFactory = trackerFactory;
  }

  parseTemplate(
    template: FormElementTemplateDictionaryOrMap,
  ): [FormElementDictionary, FirstNonValidFormElementTracker] {
    const formElementDictionary = {} as FormElementDictionary;
    const firstNonValidFormElementTracker =
      this._trackerFactory.createFirstNonValidFormElementTracker();
    const controlledFields = new Set<string>();

    for (const [fieldName, formElementTemplate] of Object.entries(template)) {
      const formElement = this._isNestedForm(formElementTemplate)
        ? this._nestedFormTemplateParser.parseTemplate(formElementTemplate)
        : this._baseFieldTemplateParser.parseTemplate(formElementTemplate);
      formElementDictionary[fieldName] = formElement;

      firstNonValidFormElementTracker.trackFormElementValidity(
        fieldName,
        formElement,
      );

      if (this._isControlledField(formElementTemplate))
        controlledFields.add(fieldName);
    }

    for (const fieldName of controlledFields) {
      const formElementTemplate =
        template instanceof Map ? template.get(fieldName) : template[fieldName];

      formElementDictionary[fieldName] =
        this._controlledFieldTemplateParser.parseTemplateAndDecorateField(
          formElementDictionary[fieldName] as AbstractField | DualField,
          formElementTemplate as ControlledFieldTemplateVariations,
          formElementDictionary,
        );
    }

    return [formElementDictionary, firstNonValidFormElementTracker];
  }

  _isNestedForm(template: FieldOrNestedFormTemplate) {
    return typeof template === 'object' && 'fields' in template;
  }

  _isControlledField(template: FieldOrNestedFormTemplate) {
    return (
      typeof template === 'object' &&
      ('asyncStateControlFn' in template ||
        'syncStateControlFn' in template ||
        'asyncValueControlFn' in template ||
        'syncValueControlFn' in template)
    );
  }
}

const FormElementTemplateDictionaryParserService = autowire<
  FormElementTemplateDictionaryParserKeyType,
  FormElementTemplateDictionaryParser,
  FormElementDictionaryParserImpl
>(FormElementDictionaryParserImpl, FormElementTemplateDictionaryParserKey, [
  BaseFieldTemplateParserKey,
  ControlledFieldTemplateParserKey,
  NestedFormTemplateParserKey,
  TrackerFactoryKey,
]);

export {
  FormElementDictionaryParserImpl,
  FormElementTemplateDictionaryParserService,
};
