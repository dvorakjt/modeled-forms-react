import { describe, test, expect, beforeEach } from 'vitest';
import { ControlledFieldTemplateParserImpl } from '../../../../../model/templates/fields/controlled/controlled-field-template-parser-impl';
import { container } from '../../../../../model/container';
import { ControlledFieldTemplateParser } from '../../../../../model/templates/fields/controlled/controlled-field-template-parser.interface';
import { SyncValueControlledFieldTemplate } from '../../../../../model/templates/fields/controlled/sync-value-controlled-field-template.type';
import { Validity } from '../../../../../model';
import { MockField } from '../../../../testing-util/mocks/mock-field';
import { FormElementDictionary } from '../../../../../model/form-elements/form-element-dictionary.type';
import { AbstractField } from '../../../../../model/fields/base/abstract-field';
import { SyncFieldValueControlFn } from '../../../../../model/fields/controlled/control-functions/fields/sync-field-value-control-fn.type';
import { SyncFieldStateControlFn } from '../../../../../model/fields/controlled/control-functions/fields/sync-field-state-control-fn.type';
import { ControlledFieldTemplateVariations } from '../../../../../model/templates/fields/controlled/controlled-field-template-variations.type';
import { SyncStateControlledFieldTemplate } from '../../../../../model/templates/fields/controlled/sync-state-controlled-field-template.type';
import { StateControlledField } from '../../../../../model/fields/controlled/state-controlled-field';
import { Observable } from 'rxjs';
import { AsyncStateControlledFieldTemplate } from '../../../../../model/templates/fields/controlled/async-state-controlled-field-template.type';
import { ValueControlledField } from '../../../../../model/fields/controlled/value-controlled-field';
import { AsyncValueControlledFieldTemplate } from '../../../../../model/templates/fields/controlled/async-value-controlled-field-template.type';
import { SyncStateControlledDualFieldTemplate } from '../../../../../model/templates/fields/controlled/sync-state-controlled-dual-field-template.type';
import { StateControlledDualField } from '../../../../../model/fields/controlled/state-controlled-dual-field';
import { AsyncStateControlledDualFieldTemplate } from '../../../../../model/templates/fields/controlled/async-state-controlled-dual-field-template.type';
import { SyncValueControlledDualFieldTemplate } from '../../../../../model/templates/fields/controlled/sync-value-controlled-dual-field-template.type';
import { ValueControlledDualField } from '../../../../../model/fields/controlled/value-controlled-dual-field';
import { AsyncValueControlledDualFieldTemplate } from '../../../../../model/templates/fields/controlled/async-value-controlled-dual-field-template.type';

describe('ControlledFieldTemplateParserImpl', () => {
  let controlledFieldTemplateParser: ControlledFieldTemplateParser;

  beforeEach(() => {
    controlledFieldTemplateParser = new ControlledFieldTemplateParserImpl(
      container.services.ControlledFieldFactory,
    );
  });

  test('It throws an error if the base field is not an instance of abstract field.', () => {
    const invalidBaseField = 'not an AbstractField';
    const template: SyncValueControlledFieldTemplate = {
      defaultValue: '',
      syncValueControlFn: ({ fieldA }) => {
        return fieldA.value.toUpperCase();
      },
    };
    const fields = {
      invalidBaseField,
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const invalidCall = () =>
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        invalidBaseField as unknown as AbstractField,
        template,
        fields as unknown as FormElementDictionary,
      );

    expect(invalidCall).toThrowError();
  });

  test('It throws an error if multiple control functions are included in the template.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
      fieldC: new MockField('', Validity.VALID_FINALIZABLE),
    };

    type InvalidTemplate = {
      defaultValue: string;
      syncValueControlFn: SyncFieldValueControlFn;
      syncStateControlFn: SyncFieldStateControlFn;
    };

    const template: InvalidTemplate = {
      defaultValue: '',
      syncValueControlFn: ({ fieldB }) => {
        return fieldB.value.toUpperCase();
      },
      syncStateControlFn: ({ fieldC }) => {
        return {
          value: fieldC.value.toLowerCase(),
        };
      },
    };

    const invalidCall = () =>
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        fields.fieldA,
        template as unknown as ControlledFieldTemplateVariations,
        fields,
      );

    expect(invalidCall).toThrowError();
  });

  test('It throws an error if there is no control type in the template.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template = {
      defaultValue: '',
    };

    const invalidCall = () =>
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        fields.fieldA,
        template as unknown as ControlledFieldTemplateVariations,
        fields,
      );

    expect(invalidCall).toThrowError();
  });

  test('A StateControlledField is returned when the template includes a syncStateControlFn and the base field is not an instance of AbstractDualField.', () => {
    const baseField = new MockField('', Validity.VALID_FINALIZABLE);

    const fields = {
      fieldA: baseField,
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template: SyncStateControlledFieldTemplate = {
      defaultValue: '',
      syncStateControlFn: ({ fieldB }) => {
        return {
          value: fieldB.value.toUpperCase(),
        };
      },
    };

    const controlledField =
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        baseField,
        template,
        fields,
      );

    expect(controlledField).toBeInstanceOf(StateControlledField);
  });

  test('A StateControlledField is returned when the template includes an asyncStateControlFn and the base field is not an instance of AbstractDualField.', () => {
    const baseField = new MockField('', Validity.VALID_FINALIZABLE);

    const fields = {
      fieldA: baseField,
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template: AsyncStateControlledFieldTemplate = {
      defaultValue: '',
      asyncStateControlFn: ({ fieldB }) => {
        return new Observable(subscriber => {
          subscriber.next({
            value: '',
          });
          setTimeout(() => {
            subscriber.next({
              value: fieldB.value.toUpperCase(),
            });
            subscriber.complete();
          }, 500);
        });
      },
    };

    const controlledField =
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        baseField,
        template,
        fields,
      );

    expect(controlledField).toBeInstanceOf(StateControlledField);
  });

  test('A ValueControlledField is returned when the template includes a syncValueControlFn and the base field is not an instance of AbstractDualField.', () => {
    const baseField = new MockField('', Validity.VALID_FINALIZABLE);

    const fields = {
      fieldA: baseField,
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template: SyncValueControlledFieldTemplate = {
      defaultValue: '',
      syncValueControlFn: ({ fieldB }) => {
        return fieldB.value.toUpperCase();
      },
    };

    const controlledField =
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        baseField,
        template,
        fields,
      );

    expect(controlledField).toBeInstanceOf(ValueControlledField);
  });

  test('A ValueControlledField is returned when the template includes an asyncValueControlFn and the base field is not an instance of AbstractDualField.', () => {
    const baseField = new MockField('', Validity.VALID_FINALIZABLE);

    const fields = {
      fieldA: baseField,
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template: AsyncValueControlledFieldTemplate = {
      defaultValue: '',
      asyncValueControlFn: ({ fieldB }) => {
        return new Observable(subscriber => {
          subscriber.next('');
          setTimeout(() => {
            subscriber.next(fieldB.value.toUpperCase());
            subscriber.complete();
          }, 500);
        });
      },
    };

    const controlledField =
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        baseField,
        template,
        fields,
      );

    expect(controlledField).toBeInstanceOf(ValueControlledField);
  });

  test('A StateControlledDualField is returned when the template includes a syncStateControlFn and the base field is an instance of AbstractDualField.', () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const fields = {
      fieldA: baseField,
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template: SyncStateControlledDualFieldTemplate = {
      primaryDefaultValue: '',
      secondaryDefaultValue: '',
      syncStateControlFn: ({ fieldB }) => {
        return {
          primaryFieldState: {
            value: fieldB.value.toUpperCase(),
          },
          useSecondaryField: false,
        };
      },
    };

    const controlledField =
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        baseField,
        template,
        fields,
      );

    expect(controlledField).toBeInstanceOf(StateControlledDualField);
  });

  test('A StateControlledDualField is returned when the template includes an asyncStateControlFn and the base field is an instance of AbstractDualField.', () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const fields = {
      fieldA: baseField,
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template: AsyncStateControlledDualFieldTemplate = {
      primaryDefaultValue: '',
      secondaryDefaultValue: '',
      asyncStateControlFn: ({ fieldB }) => {
        return new Observable(subscriber => {
          subscriber.next({
            primaryFieldState: {
              value: '',
              validity: Validity.PENDING,
            },
            useSecondaryField: false,
          });
          setTimeout(() => {
            subscriber.next({
              primaryFieldState: {
                value: fieldB.value.toUpperCase(),
                validity: Validity.VALID_FINALIZABLE,
              },
              useSecondaryField: false,
            });
          }, 500);
        });
      },
    };

    const controlledField =
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        baseField,
        template,
        fields,
      );

    expect(controlledField).toBeInstanceOf(StateControlledDualField);
  });

  test('A ValueControlledDualField is returned when the template includes a syncValueControlFn and the base field is an instance of AbstractDualField.', () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const fields = {
      fieldA: baseField,
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template: SyncValueControlledDualFieldTemplate = {
      primaryDefaultValue: '',
      secondaryDefaultValue: '',
      syncValueControlFn: ({ fieldB }) => {
        return {
          primaryFieldValue: fieldB.value.toUpperCase(),
          useSecondaryField: false,
        };
      },
    };

    const controlledField =
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        baseField,
        template,
        fields,
      );

    expect(controlledField).toBeInstanceOf(ValueControlledDualField);
  });

  test('A ValueControlledDualField is returned when the template includes an asyncValueControlFn and the base field is an instance of AbstractDualField.', () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const fields = {
      fieldA: baseField,
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template: AsyncValueControlledDualFieldTemplate = {
      primaryDefaultValue: '',
      secondaryDefaultValue: '',
      asyncValueControlFn: ({ fieldB }) => {
        return new Observable(subscriber => {
          subscriber.next({
            primaryFieldValue: '',
            useSecondaryField: false,
          });
          setTimeout(() => {
            subscriber.next({
              primaryFieldValue: fieldB.value.toUpperCase(),
              useSecondaryField: false,
            });
            subscriber.complete();
          }, 500);
        });
      },
    };

    const controlledField =
      controlledFieldTemplateParser.parseTemplateAndDecorateField(
        baseField,
        template,
        fields,
      );

    expect(controlledField).toBeInstanceOf(ValueControlledDualField);
  });
});
