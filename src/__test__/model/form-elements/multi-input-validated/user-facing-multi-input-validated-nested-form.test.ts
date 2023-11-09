import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../../model/container';
import {
  MessageType,
  NestedFormTemplate,
  Validity,
  required,
} from '../../../../model';
import { UserFacingMultiInputValidatedNestedForm } from '../../../../model/form-elements/multi-input-validated/user-facing-multi-input-validated-nested-form';
import { MockField } from '../../../util/mocks/mock-field';
import { AbstractField } from '../../../../model/fields/base/abstract-field';
import { SyncValidator } from '../../../../model/validators/sync-validator.type';
import { AggregatedStateChanges } from '../../../../model/aggregators/aggregated-state-changes.interface';
import { Visited } from '../../../../model/state/visited.enum';
import { Modified } from '../../../../model/state/modified.enum';

describe('UserFacingMultiInputValidatedNestedForm', () => {
  test("userFacingFields returns the base nested form's userFacingFields.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(userFacingMultiInputValidatedNestedForm.userFacingFields).toBe(
      baseNestedForm.userFacingFields,
    );
  });

  test("extractedValues returns the base nested form's extractedValues.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
      extractedValues: {
        syncExtractedValues: {
          allCapsFieldA: ({ fieldA }) => fieldA.value.toUpperCase(),
        },
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(userFacingMultiInputValidatedNestedForm.extractedValues).toBe(
      baseNestedForm.extractedValues,
    );
  });

  test("state returns the base nested form's value.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: 'test 1',
        fieldB: 'test 2',
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(userFacingMultiInputValidatedNestedForm.state.value).toStrictEqual({
      fieldA: 'test 1',
      fieldB: 'test 2',
    });
  });

  test("state returns the base nested form's messages.", () => {
    const expectedMessageText = 'Either fieldA or fieldB has an empty value.';

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
              message: isValid ? 'Both fields are valid.' : expectedMessageText,
            };
          },
        ],
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(
      userFacingMultiInputValidatedNestedForm.state.messages,
    ).toStrictEqual([
      {
        text: expectedMessageText,
        type: MessageType.INVALID,
      },
    ]);
  });

  test("state returns the minimum of the base nested form's validity and the MultiInputValidatorReducer's validity.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: {
          defaultValue: '',
          syncValidators: [required('Field A is required')],
        },
        fieldB: '',
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(userFacingMultiInputValidatedNestedForm.state.validity).toBe(
      Validity.INVALID,
    );

    (baseNestedForm.userFacingFields.fieldA as AbstractField).setValue(
      'some value',
    );

    expect(userFacingMultiInputValidatedNestedForm.state.validity).toBe(
      Validity.VALID_FINALIZABLE,
    );

    const fields = {
      nestedForm: baseNestedForm,
      someField: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockMultiInputValidatorBaseFn: SyncValidator<
      AggregatedStateChanges
    > = ({ nestedForm, someField }) => {
      return {
        isValid: false,
      };
    };

    const multiInputValidator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        mockMultiInputValidatorBaseFn,
        fields,
      );

    userFacingMultiInputValidatedNestedForm.addValidator(multiInputValidator);

    expect(userFacingMultiInputValidatedNestedForm.state.validity).toBe(
      Validity.INVALID,
    );
  });

  test("state returns the base nested form's omit.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
      omitByDefault: true,
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(userFacingMultiInputValidatedNestedForm.state.omit).toBe(true);
  });

  test("state returns the base nested form's visited property.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    (baseNestedForm.userFacingFields.fieldA as AbstractField).setState({
      visited: Visited.YES,
    });

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(userFacingMultiInputValidatedNestedForm.state.visited).toBe(
      Visited.PARTIALLY,
    );
  });

  test("state returns the base nested form's modified property.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    (baseNestedForm.userFacingFields.fieldA as AbstractField).setState({
      modified: Modified.YES,
    });

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(userFacingMultiInputValidatedNestedForm.state.modified).toBe(
      Modified.PARTIALLY,
    );
  });

  test("omit returns the base nested form's omit property.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
      omitByDefault: true,
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(userFacingMultiInputValidatedNestedForm.omit).toBe(true);
  });

  test("setting omit sets the base nested form's omit property.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    userFacingMultiInputValidatedNestedForm.omit = true;

    expect(baseNestedForm.omit).toBe(true);
  });

  test("firstNonValidFormElement returns the base nested form's firstNonValidFormElement.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: {
          defaultValue: '',
          syncValidators: [required('Field B is required.')],
        },
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(
      userFacingMultiInputValidatedNestedForm.firstNonValidFormElement,
    ).toBe('fieldB');
  });

  test("firstNonValidFormElementChanges returns the base nested form's firstNonValidFormElementChanges.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    expect(
      userFacingMultiInputValidatedNestedForm.firstNonValidFormElementChanges,
    ).toBe(baseNestedForm.firstNonValidFormElementChanges);
  });

  test("When reset() is called, the base nested form's reset() method is called.", () => {
    const nestedFormTemplate: NestedFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
    };

    const baseNestedForm =
      container.services.NestedFormTemplateParser.parseTemplate(
        nestedFormTemplate,
      );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm,
      );

    const userFacingMultiInputValidatedNestedForm =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedNestedForm;

    vi.spyOn(baseNestedForm, 'reset');

    userFacingMultiInputValidatedNestedForm.reset();

    expect(baseNestedForm.reset).toHaveBeenCalledOnce();
  });
});
