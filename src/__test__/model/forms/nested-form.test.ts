import { describe, test, expect } from 'vitest';
import { container } from '../../../model/container';
import { MessageType, NestedFormTemplate, Validity, required } from '../../../model';
import { AbstractField } from '../../../model/fields/base/abstract-field';
import { Visited } from '../../../model/state/visited.enum';
import { Modified } from '../../../model/state/modified-enum';

describe('NestedForm', () => {
  test('state returns the expected value for state.', () => {
    const expectedMFVMessageText = 'Field C must NOT equal Field D.';

    const nestedFormTemplate : NestedFormTemplate = {
      fields : {
        fieldA : 'test',
        fieldB : {
          defaultValue : '',
          syncValidators : [
            required('Field B is required.')
          ]
        },
        fieldC : 'test',
        fieldD : 'test',
      },
      multiFieldValidators : {
        sync : [
          ({ fieldC, fieldD }) => {
            const isValid = fieldC.value !== fieldD.value;

            return ({
              isValid,
              message : isValid ? undefined : expectedMFVMessageText
            })
          }
        ]
      },
      finalizedFields : {
        errantFinalizer : {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          syncFinalizerFn : ({ fieldA }) => {
            throw new Error('Finalizer error.')
          },
          preserveOriginalFields : true
        }
      },
      omitByDefault : true
    }

    const nestedForm = container.services.NestedFormTemplateParser.parseTemplate(nestedFormTemplate);

    (nestedForm.userFacingFields.fieldB as AbstractField).setState({
      visited : Visited.YES
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
      value : {
        fieldA : 'test'
      },
      validity : Validity.ERROR,
      messages : [
        {
          text : expectedMFVMessageText,
          type : MessageType.INVALID
        },
        {
          text : container.services.ConfigLoader.config.globalMessages.finalizerError,
          type : MessageType.ERROR
        }
      ],
      visited : Visited.PARTIALLY,
      modified : Modified.PARTIALLY,
      omit : true
    });
  });

  test('firstNonValidFormElement returns the expected firstNonValidFormElement.', () => {
    //here, we use a map to guarantee accurate key order
    const nestedFormTemplate : NestedFormTemplate = {
      fields : new Map([
        [
          'fieldA', 
          {
            defaultValue : '',
            syncValidators : [
              required('Field A is required.')
            ]
          }
        ],
        [
          'fieldB',
          {
            defaultValue : '',
            syncValidators : [
              required('Field B is required.')
            ]
          }
        ]
      ])
    }

    const nestedForm = container.services.NestedFormTemplateParser.parseTemplate(nestedFormTemplate);

    console.log(nestedForm);

    expect(nestedForm.firstNonValidFormElement).toBe('fieldA');

    (nestedForm.userFacingFields.fieldA as AbstractField).setValue('some value');

    expect(nestedForm.firstNonValidFormElement).toBe('fieldB');

    (nestedForm.userFacingFields.fieldB as AbstractField).setValue('some other value');

    expect(nestedForm.firstNonValidFormElement).toBeUndefined();
  });
});