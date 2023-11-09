import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../model/container';
import {
  MessageType,
  NestedFormTemplate,
  Validity,
  required,
} from '../../../model';
import { AbstractField } from '../../../model/fields/base/abstract-field';
import { Visited } from '../../../model/state/visited.enum';
import { Modified } from '../../../model/state/modified.enum';
import { AbstractDualField } from '../../../model/fields/base/abstract-dual-field';
import { NestedForm } from '../../../model/forms/nested-form';
import { AbstractNestedForm } from '../../../model/forms/abstract-nested-form';

describe('NestedForm', () => {
  test('state returns the expected value for state.', () => {
    const expectedMFVMessageText = 'Field C must NOT equal Field D.';

    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: 'test',
        fieldB: {
          defaultValue: '',
          syncValidators: [required('Field B is required.')],
        },
        fieldC: 'test',
        fieldD: 'test',
      },
      multiFieldValidators: {
        sync: [
          ({ fieldC, fieldD }) => {
            const isValid = fieldC.value !== fieldD.value;

            return {
              isValid,
              message: isValid ? undefined : expectedMFVMessageText,
            };
          },
        ],
      },
      finalizedFields: {
        errantFinalizer: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          syncFinalizerFn: ({ fieldA }) => {
            throw new Error('Finalizer error.');
          },
          preserveOriginalFields: true,
        },
      },
      omitByDefault: true,
    };

    const nestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    (nestedForm.userFacingFields.fieldB as AbstractField).setState({
      visited: Visited.YES,
    });

    /*
      - Only fieldA is included in the value. fieldB is invalid, and the multiInputValidator assigned to fields C And D is likewise invalid. \
      - fieldA is included despite being used by errantFinalizer as preserveOriginalFields is true
      - errantFinalizer is not included in the value as it will throw an error
      - validity is Validity.ERROR because of the finalizer error
      - messages includes the message produced by the MultiInputValidator and the global finalizerError message
      - modified is Modified.Partially as 3 of the fields default to Modified.YES
      - visited is Visited.Partially because setState is called on fieldB to set its visited property to Visited.YES
      - omit is true as omitByDefault was set to true in the template
    */
    expect(nestedForm.state).toStrictEqual({
      value: {
        fieldA: 'test',
      },
      validity: Validity.ERROR,
      messages: [
        {
          text: expectedMFVMessageText,
          type: MessageType.INVALID,
        },
        {
          text: container.services.ConfigLoader.config.globalMessages
            .finalizerError,
          type: MessageType.ERROR,
        },
      ],
      visited: Visited.PARTIALLY,
      modified: Modified.PARTIALLY,
      omit: true,
    });
  });

  test('firstNonValidFormElement returns the expected firstNonValidFormElement.', () => {
    //here, we use a map to guarantee accurate key order
    const nestedFormTemplate: NestedFormTemplate = {
      fields: new Map([
        [
          'fieldA',
          {
            defaultValue: '',
            syncValidators: [required('Field A is required.')],
          },
        ],
        [
          'fieldB',
          {
            defaultValue: '',
            syncValidators: [required('Field B is required.')],
          },
        ],
      ]),
    };

    const nestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    expect(nestedForm.firstNonValidFormElement).toBe('fieldA');

    (nestedForm.userFacingFields.fieldA as AbstractField).setValue(
      'some value',
    );

    expect(nestedForm.firstNonValidFormElement).toBe('fieldB');

    (nestedForm.userFacingFields.fieldB as AbstractField).setValue(
      'some other value',
    );

    expect(nestedForm.firstNonValidFormElement).toBeUndefined();
  });

  test('firstNonFormElementChanges emits expected firstNonValidFormElements.', () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: new Map([
        [
          'fieldA',
          {
            defaultValue: '',
            syncValidators: [required('Field A is required.')],
          },
        ],
        [
          'fieldB',
          {
            defaultValue: '',
            syncValidators: [required('Field B is required.')],
          },
        ],
      ]),
    };

    const nestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const expectedNonValidFormElements = ['fieldA', 'fieldB', undefined];
    let expectedNonValidFormElementIndex = 0;

    nestedForm.firstNonValidFormElementChanges.subscribe(change => {
      expect(change).toBe(
        expectedNonValidFormElements[expectedNonValidFormElementIndex++],
      );

      if (expectedNonValidFormElementIndex === 1) {
        (nestedForm.userFacingFields.fieldA as AbstractField).setValue(
          'some value',
        );
      } else if (expectedNonValidFormElementIndex === 2) {
        (nestedForm.userFacingFields.fieldB as AbstractField).setValue(
          'some other value',
        );
      }
    });
  });

  test('setting omit causes a new state to be emitted.', () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
    };

    const nestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    nestedForm.omit = true;

    nestedForm.stateChanges.subscribe(change => {
      expect(change.omit).toBe(true);
    });
  });

  test("getting omit returns the form's _omit value.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
      omitByDefault: true,
    };

    const nestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    expect(nestedForm.omit).toBe(true);

    nestedForm.omit = false;

    expect(nestedForm.omit).toBe(false);
  });

  test("calling reset() resets all of the form's fields.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: {
          defaultValue: '',
          omitByDefault: true,
        },
        fieldB: {
          primaryDefaultValue: '',
          secondaryDefaultValue: '',
        },
      },
    };

    const nestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const { fieldA, fieldB } = nestedForm.userFacingFields;

    (fieldA as AbstractField).setValue('test');
    fieldA.omit = false;

    (fieldB as AbstractDualField).useSecondaryField = true;

    nestedForm.reset();

    expect(fieldA.state.value).toBe('');
    expect(fieldA.omit).toBe(true);

    expect((fieldB as AbstractDualField).useSecondaryField).toBe(false);
  });

  test('When the MultiFieldValidatorAggregator emits a new message, state changes emits a new state.', () => {
    const expectedValidMessageText = 'Field A and Field B are both valid.';
    const expectedInvalidMessageText =
      'Field B and Field A must not have empty values.';

    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
      multiFieldValidators: {
        sync: [
          ({ fieldA, fieldB }) => {
            const isValid = fieldA.value && fieldB.value;

            return {
              isValid,
              message: isValid
                ? expectedValidMessageText
                : expectedInvalidMessageText,
            };
          },
        ],
      },
    };

    const nestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    (
      nestedForm as NestedForm
    )._multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(() => {
      if (nestedForm.state.validity === Validity.INVALID) {
        expect(nestedForm.state.messages).toStrictEqual([
          {
            text: expectedInvalidMessageText,
            type: MessageType.INVALID,
          },
        ]);
      } else {
        expect(nestedForm.state.messages).toStrictEqual([
          {
            text: expectedValidMessageText,
            type: MessageType.VALID,
          },
        ]);
      }
    });

    (nestedForm.userFacingFields.fieldA as AbstractField).setValue(
      'some value',
    );
    (nestedForm.userFacingFields.fieldB as AbstractField).setValue(
      'some other value',
    );
  });

  test('calling tryConfirm() calls tryConfirm() on all fields that are nested forms.', () => {
    const template: NestedFormTemplate = {
      fields: {
        anotherNestedForm: {
          fields: {
            fieldA: '',
          },
        },
      },
    };

    const nestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(template);

    const anotherNestedForm = nestedForm.userFacingFields
      .anotherNestedForm as AbstractNestedForm;

    vi.spyOn(anotherNestedForm, 'tryConfirm');

    nestedForm.tryConfirm({});

    expect(anotherNestedForm.tryConfirm).toHaveBeenCalledOnce();
  });

  test('If confirmationManager.confirmationState.message is defined, it is included in state.messages.', () => {
    const template: NestedFormTemplate = {
      fields: {
        fieldA: {
          defaultValue: '',
          syncValidators: [required('field A is required')],
        },
      },
    };

    const nestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(template);

    const expectedErrorMessage = 'There are invalid or pending fields.';

    nestedForm.tryConfirm({ errorMessage: expectedErrorMessage });

    expect(nestedForm.state.messages).toStrictEqual([
      {
        text: expectedErrorMessage,
        type: MessageType.INVALID,
      },
    ]);
  });
});
