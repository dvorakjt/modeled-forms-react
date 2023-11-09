import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../model/container';
import {
  MessageType,
  RootFormTemplate,
  Validity,
  required,
} from '../../../model';
import { AbstractField } from '../../../model/fields/base/abstract-field';
import { Visited } from '../../../model/state/visited.enum';
import { Modified } from '../../../model/state/modified.enum';
import { AbstractDualField } from '../../../model/fields/base/abstract-dual-field';
import { RootForm } from '../../../model/forms/root-form';
import { AbstractNestedForm } from '../../../model/forms/abstract-nested-form';
import { waitFor } from '@testing-library/react';

describe('RootForm', () => {
  test('state returns the expected value for state.', () => {
    const expectedMFVMessageText = 'Field C must NOT equal Field D.';

    const rootFormTemplate: RootFormTemplate = {
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
      submitFn: () => {
        return new Promise(resolve => {
          resolve('Response from imaginary server');
        });
      },
    };

    const rootForm =
      container.services.RootFormTemplateParser.parseTemplate(rootFormTemplate);

    (rootForm.userFacingFields.fieldB as AbstractField).setState({
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
    expect(rootForm.state).toStrictEqual({
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
    });
  });

  test('firstNonValidFormElement returns the expected firstNonValidFormElement.', () => {
    //here, we use a map to guarantee accurate key order
    const rootFormTemplate: RootFormTemplate = {
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
      submitFn: () => {
        return new Promise(resolve => {
          resolve('Response from imaginary server');
        });
      },
    };

    const rootForm =
      container.services.RootFormTemplateParser.parseTemplate(rootFormTemplate);

    expect(rootForm.firstNonValidFormElement).toBe('fieldA');

    (rootForm.userFacingFields.fieldA as AbstractField).setValue('some value');

    expect(rootForm.firstNonValidFormElement).toBe('fieldB');

    (rootForm.userFacingFields.fieldB as AbstractField).setValue(
      'some other value',
    );

    expect(rootForm.firstNonValidFormElement).toBeUndefined();
  });

  test('firstNonFormElementChanges emits expected firstNonValidFormElements.', () => {
    const rootFormTemplate: RootFormTemplate = {
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
      submitFn: () => {
        return new Promise(resolve => {
          resolve('Response from imaginary server');
        });
      },
    };

    const rootForm =
      container.services.RootFormTemplateParser.parseTemplate(rootFormTemplate);

    const expectedNonValidFormElements = ['fieldA', 'fieldB', undefined];
    let expectedNonValidFormElementIndex = 0;

    rootForm.firstNonValidFormElementChanges.subscribe(change => {
      expect(change).toBe(
        expectedNonValidFormElements[expectedNonValidFormElementIndex++],
      );

      if (expectedNonValidFormElementIndex === 1) {
        (rootForm.userFacingFields.fieldA as AbstractField).setValue(
          'some value',
        );
      } else if (expectedNonValidFormElementIndex === 2) {
        (rootForm.userFacingFields.fieldB as AbstractField).setValue(
          'some other value',
        );
      }
    });
  });

  test("calling reset() resets all of the form's fields.", () => {
    const rootFormTemplate: RootFormTemplate = {
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
      submitFn: () => {
        return new Promise(resolve => {
          resolve('Response from imaginary server');
        });
      },
    };

    const rootForm =
      container.services.RootFormTemplateParser.parseTemplate(rootFormTemplate);

    const { fieldA, fieldB } = rootForm.userFacingFields;

    (fieldA as AbstractField).setValue('test');
    fieldA.omit = false;

    (fieldB as AbstractDualField).useSecondaryField = true;

    rootForm.reset();

    expect(fieldA.state.value).toBe('');
    expect(fieldA.omit).toBe(true);

    expect((fieldB as AbstractDualField).useSecondaryField).toBe(false);
  });

  test('When the MultiFieldValidatorAggregator emits a new message, state changes emits a new state.', () => {
    const expectedValidMessageText = 'Field A and Field B are both valid.';
    const expectedInvalidMessageText =
      'Field B and Field A must not have empty values.';

    const rootFormTemplate: RootFormTemplate = {
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
      submitFn: () => {
        return new Promise(resolve => {
          resolve('Response from imaginary server');
        });
      },
    };

    const rootForm =
      container.services.RootFormTemplateParser.parseTemplate(rootFormTemplate);

    (
      rootForm as RootForm
    )._multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(() => {
      if (rootForm.state.validity === Validity.INVALID) {
        expect(rootForm.state.messages).toStrictEqual([
          {
            text: expectedInvalidMessageText,
            type: MessageType.INVALID,
          },
        ]);
      } else {
        expect(rootForm.state.messages).toStrictEqual([
          {
            text: expectedValidMessageText,
            type: MessageType.VALID,
          },
        ]);
      }
    });

    (rootForm.userFacingFields.fieldA as AbstractField).setValue('some value');
    (rootForm.userFacingFields.fieldB as AbstractField).setValue(
      'some other value',
    );
  });

  test('calling tryConfirm() calls tryConfirm() on all fields that are nested forms.', () => {
    const template: RootFormTemplate = {
      fields: {
        nestedForm: {
          fields: {
            fieldA: '',
          },
        },
      },
      submitFn: () => {
        return new Promise(resolve => {
          resolve('Response from imaginary server');
        });
      },
    };

    const rootForm =
      container.services.RootFormTemplateParser.parseTemplate(template);

    const nestedForm = rootForm.userFacingFields
      .nestedForm as AbstractNestedForm;

    vi.spyOn(nestedForm, 'tryConfirm');

    rootForm.tryConfirm({});

    expect(nestedForm.tryConfirm).toHaveBeenCalledOnce();
  });

  test('If confirmationManager.confirmationState.message is defined, it is included in state.messages.', () => {
    const template: RootFormTemplate = {
      fields: {
        fieldA: {
          defaultValue: '',
          syncValidators: [required('field A is required')],
        },
      },
      submitFn: () => {
        return new Promise(resolve => {
          resolve('Response from imaginary server');
        });
      },
    };

    const rootForm =
      container.services.RootFormTemplateParser.parseTemplate(template);

    const expectedErrorMessage = 'There are invalid or pending fields.';

    rootForm.tryConfirm({ errorMessage: expectedErrorMessage });

    expect(rootForm.state.messages).toStrictEqual([
      {
        text: expectedErrorMessage,
        type: MessageType.INVALID,
      },
    ]);
  });

  test("trySubmit resets the SubmissionManager's message property.", async () => {
    const template: RootFormTemplate = {
      fields: {
        fieldA: '',
      },
      submitFn: () => {
        return new Promise(resolve => {
          resolve('Response from imaginary server');
        });
      },
    };

    const rootForm = container.services.RootFormTemplateParser.parseTemplate(
      template,
    ) as RootForm;

    const expectedMessage = {
      text: 'error submitting the form',
      type: MessageType.ERROR,
    };

    rootForm._submissionManager.message = expectedMessage;

    expect(rootForm.state.messages).toStrictEqual([expectedMessage]);

    rootForm.trySubmit({});

    await waitFor(() => expect(rootForm.state.messages).toStrictEqual([]));
  });
});
