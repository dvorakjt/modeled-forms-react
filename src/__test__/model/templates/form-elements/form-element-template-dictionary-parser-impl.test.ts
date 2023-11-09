import { describe, test, expect } from 'vitest';
import { container } from '../../../../model/container';
import { required } from '../../../../model';
import { FormElementTemplateDictionaryOrMap } from '../../../../model/templates/form-elements/form-element-template-dictionary-or-map.type';
import { AbstractField } from '../../../../model/fields/base/abstract-field';
import { AbstractDualField } from '../../../../model/fields/base/abstract-dual-field';
import { ValueControlledField } from '../../../../model/fields/controlled/value-controlled-field';
import { AbstractNestedForm } from '../../../../model/forms/abstract-nested-form';
import { FieldOrNestedFormTemplate } from '../../../../model/templates/form-elements/field-or-nested-form-template.type';

describe('FormElementDictionaryParserImpl', () => {
  test('parseTemplate returns the expected FormElementDictionary when an object is passed in as a template.', () => {
    const template: FormElementTemplateDictionaryOrMap = {
      simpleFieldA: '',
      simpleFieldB: {
        defaultValue: '',
        syncValidators: [required('Field B is required')],
      },
      dualField: {
        primaryDefaultValue: '',
        secondaryDefaultValue: '',
      },
      controlledField: {
        defaultValue: '',
        syncValueControlFn: ({ simpleFieldA }) => {
          return simpleFieldA.value.toUpperCase();
        },
      },
      nestedForm: {
        fields: {
          fieldA: '',
          fieldB: '',
        },
      },
    };

    const parsed =
      container.services.FormElementTemplateDictionaryParser.parseTemplate(
        template,
      );

    const formElementDictionary = parsed[0];

    expect(formElementDictionary.simpleFieldA).toBeInstanceOf(AbstractField);
    expect(formElementDictionary.simpleFieldB).toBeInstanceOf(AbstractField);
    expect(formElementDictionary.dualField).toBeInstanceOf(AbstractDualField);
    expect(formElementDictionary.controlledField).toBeInstanceOf(
      ValueControlledField,
    );
    expect(formElementDictionary.nestedForm).toBeInstanceOf(AbstractNestedForm);
  });

  test('parseTemplate returns the expected FormElementDictionary when a Map is passed in as a template.', () => {
    const template: FormElementTemplateDictionaryOrMap = new Map<
      string,
      FieldOrNestedFormTemplate
    >([
      ['simpleFieldA', ''],
      [
        'simpleFieldB',
        {
          defaultValue: '',
          syncValidators: [required('Field B is required')],
        },
      ],
      [
        'dualField',
        {
          primaryDefaultValue: '',
          secondaryDefaultValue: '',
        },
      ],
      [
        'controlledField',
        {
          defaultValue: '',
          syncValueControlFn: ({ simpleFieldA }) => {
            return simpleFieldA.value.toUpperCase();
          },
        },
      ],
      [
        'nestedForm',
        {
          fields: new Map([
            ['fieldA', ''],
            ['fieldB', ''],
          ]),
        },
      ],
    ]);

    const parsed =
      container.services.FormElementTemplateDictionaryParser.parseTemplate(
        template,
      );

    const formElementDictionary = parsed[0];

    expect(formElementDictionary.simpleFieldA).toBeInstanceOf(AbstractField);
    expect(formElementDictionary.simpleFieldB).toBeInstanceOf(AbstractField);
    expect(formElementDictionary.dualField).toBeInstanceOf(AbstractDualField);
    expect(formElementDictionary.controlledField).toBeInstanceOf(
      ValueControlledField,
    );
    expect(formElementDictionary.nestedForm).toBeInstanceOf(AbstractNestedForm);
  });

  test('parseTemplate returns the expected FirstNonValidFormElementTracker.', () => {
    const template = new Map<string, FieldOrNestedFormTemplate>([
      [
        'fieldA',
        {
          defaultValue: '',
          syncValidators: [required('Field A is required')],
        },
      ],
      [
        'fieldB',
        {
          defaultValue: '',
          syncValidators: [required('Field B is required')],
        },
      ],
      [
        'fieldC',
        {
          defaultValue: '',
          syncValidators: [required('Field C is required')],
        },
      ],
    ]);

    const parsed =
      container.services.FormElementTemplateDictionaryParser.parseTemplate(
        template,
      );

    const [formElementDictionary, firstNonValidFormElementTracker] = parsed;

    expect(firstNonValidFormElementTracker.firstNonValidFormElement).toBe(
      'fieldA',
    );

    (formElementDictionary.fieldA as AbstractField).setValue('some value');

    expect(firstNonValidFormElementTracker.firstNonValidFormElement).toBe(
      'fieldB',
    );

    (formElementDictionary.fieldB as AbstractField).setValue(
      'some other value',
    );

    expect(firstNonValidFormElementTracker.firstNonValidFormElement).toBe(
      'fieldC',
    );

    (formElementDictionary.fieldC as AbstractField).setValue(
      'yet another value',
    );

    expect(
      firstNonValidFormElementTracker.firstNonValidFormElement,
    ).toBeUndefined();
  });
});
