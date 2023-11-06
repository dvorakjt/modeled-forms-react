import { describe, test, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRootForm } from "../../hooks";
import { MessageType, RootFormTemplate, Validity, required } from "../../model";
import { container } from "../../model/container";
import { Visited } from "../../model/state/visited.enum";
import { Modified } from "../../model/state/modified-enum";

describe('useFormState()', () => {
  test('It returns a value which is updated as the form\'s value is updated.', () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : 'FIELD A',
        fieldB : 'field b'
      },
      finalizedFields : {
        lowercaseFieldA : {
          syncFinalizerFn : ({ fieldA }) => fieldA.value.toLowerCase()
        },
        uppercaseFieldB : {
          syncFinalizerFn : ({ fieldB }) => fieldB.value.toUpperCase(),
          preserveOriginalFields : true
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const { result : useRootFormResult } = renderHook(() => useRootForm(template));

    const { useFormState } = useRootFormResult.current;

    const { result : useFormStateResult } = renderHook(() => useFormState());

    expect(useFormStateResult.current.value).toStrictEqual({
      lowercaseFieldA : 'field a',
      uppercaseFieldB : 'FIELD B',
      fieldB : 'field b'
    });
  });

  test('It returns validity which is updated as the form\'s state.validity property is updated.', async () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : {
          defaultValue : '',
          syncValidators : [required('field A is required')]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const { result : useRootFormResult } = renderHook(() => useRootForm(template));

    const { useFormState, useField } = useRootFormResult.current;

    const { result : useFormStateResult } = renderHook(() => useFormState());

    expect(useFormStateResult.current.validity).toBe(Validity.INVALID);

    const { result : useFieldResult } = renderHook(() => useField('fieldA'));

    const { updateValue } = useFieldResult.current;

    updateValue('some value');

    await waitFor(() => expect(useFormStateResult.current.validity).toBe(Validity.VALID_FINALIZABLE));
  });

  test('It returns messages which is updated as the form\'s state.messages property is updated.', async () => {
    const expectedMultiFieldValidatorMessage = 'field A and field B must both have value';

    const template : RootFormTemplate = {
      fields : {
        fieldA : '',
        fieldB : ''
      },
      multiFieldValidators : {
        sync : [
          ({fieldA , fieldB }) => {
            const isValid = fieldA.value && fieldB.value;

            return {
              isValid,
              message : isValid ? undefined : expectedMultiFieldValidatorMessage
            }
          }
        ]
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const { result : useRootFormResult } = renderHook(() => useRootForm(template));

    const { useFormState, trySubmit } = useRootFormResult.current;

    const { result : useFormStateResult } = renderHook(() => useFormState());

    trySubmit({});

    await waitFor(() => expect(useFormStateResult.current.messages).toStrictEqual([
      {
        text : expectedMultiFieldValidatorMessage,
        type : MessageType.INVALID
      },
      {
        text : container.services.ConfigLoader.config.globalMessages.confirmationFailed,
        type : MessageType.INVALID
      }
    ]));
  });

  test('It returns visited which is updated when the form\'s state.visited property is updated.', async () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const { result : useRootFormResult } = renderHook(() => useRootForm(template));

    const { useFormState, useField } = useRootFormResult.current;

    const { result : useFormStateResult } = renderHook(() => useFormState());

    expect(useFormStateResult.current.visited).toBe(Visited.NO);

    const { result : useFieldResult } = renderHook(() => useField('fieldA'));

    const { visit } = useFieldResult.current;

    visit();

    await waitFor(() => expect(useFormStateResult.current.visited).toBe(Visited.YES));
  });

  test('It returns modified which is updated when the form\'s state.modified property is updated.', async () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const { result : useRootFormResult } = renderHook(() => useRootForm(template));

    const { useFormState, useField } = useRootFormResult.current;

    const { result : useFormStateResult } = renderHook(() => useFormState());

    expect(useFormStateResult.current.modified).toBe(Modified.NO);

    const { result : useFieldResult } = renderHook(() => useField('fieldA'));

    const { updateValue } = useFieldResult.current;

    updateValue('some value');

    await waitFor(() => expect(useFormStateResult.current.modified).toBe(Modified.YES));
  });
});