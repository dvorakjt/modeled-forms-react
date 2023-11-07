import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { render, renderHook, waitFor } from '@testing-library/react';
import { renderPossiblyErrantHook } from '../util/hooks/render-possibly-errant-hook';
import { useRootForm } from '../../hooks';
import { MessageType, RootFormTemplate, Validity, required } from '../../model';
import { Visited } from '../../model/state/visited.enum';
import { useField as useFieldRaw } from '../../hooks/use-field';
import { AbstractField } from '../../model/fields/base/abstract-field';
import { Modified } from '../../model/state/modified.enum';

describe('useField', () => {
  test('It throws an error if the field name does not exist in the template.', () => {
    const template : RootFormTemplate = {
      fields : {
        someField : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useField } = useRootFormResult.current;

    const { errorDetected } = renderPossiblyErrantHook(() => useField('nonExistentField'));

    expect(errorDetected).toBe(true);
  });

  test('It throws an error if the field name represents a nested form.', () => {
    const template : RootFormTemplate = {
      fields : {
        nestedForm : {
          fields : {
            fieldA : ''
          }
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useField } = useRootFormResult.current;

    const { errorDetected } = renderPossiblyErrantHook(() => useField('nestedForm'));

    expect(errorDetected).toBe(true);
  });

  test('It returns a value which is updated as the field model\'s state.value updates.', async () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : 'test'
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useField } = useRootFormResult.current;
    const { result : useFieldResult } = renderHook(() => useField('fieldA'));
    
    const { value, updateValue } = useFieldResult.current;

    expect(value).toBe('test');

    updateValue('test 2');

    await waitFor(() => expect(useFieldResult.current.value).toBe('test 2'));
  });

  test('It returns validity which is updated as the field model\'s state.validity updates.', async () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : {
          defaultValue : '',
          syncValidators : [required('Field A is required.')]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useField } = useRootFormResult.current;
    const { result : useFieldResult } = renderHook(() => useField('fieldA'));
    
    const { validity, updateValue } = useFieldResult.current;

    expect(validity).toBe(Validity.INVALID);

    updateValue('some value');

    await waitFor(() => expect(useFieldResult.current.validity).toBe(Validity.VALID_FINALIZABLE));
  });

  test('It returns messages which is updated as the field model\'s state.messages updates.', async () => {
    const expectedInvalidMessage = 'Field A is required.';
    const expectedValidMessage = 'Field is valid.';

    const template : RootFormTemplate = {
      fields : {
        fieldA : {
          defaultValue : '',
          syncValidators : [required(expectedInvalidMessage, expectedValidMessage)]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useField } = useRootFormResult.current;
    const { result : useFieldResult } = renderHook(() => useField('fieldA'));
    
    const { messages, updateValue } = useFieldResult.current;

    expect(messages).toStrictEqual([
      {
        text : expectedInvalidMessage,
        type : MessageType.INVALID
      }
    ]);

    updateValue('some value');

    await waitFor(() => expect(useFieldResult.current.messages).toStrictEqual([
      {
        text : expectedValidMessage,
        type : MessageType.VALID
      }
    ]));
  });

  test('It returns visited which is updated as the field model\'s state.visited updates.', async () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useField } = useRootFormResult.current;
    const { result : useFieldResult } = renderHook(() => useField('fieldA'));
    
    const { visited, visit } = useFieldResult.current;

    expect(visited).toBe(Visited.NO);

    visit();

    await waitFor(() => expect(useFieldResult.current.visited).toBe(Visited.YES));
  });

  test('When the component unmounts, stateChanges is unsubscribed from.', async () => {
    const subscription = {
      unsubscribe : vi.fn()
    }

    const field = {
      state : {
        value : '',
        validity : Validity.VALID_FINALIZABLE,
        visited : Visited.NO,
        modified : Modified.NO,
        messages : []
      },
      stateChanges : {
        subscribe : () => {
          return subscription;
        }
      }
    } as unknown as AbstractField;

    function WrapperComponent() {
      useFieldRaw(field);

      return null;
    }

    const { unmount } = render(<WrapperComponent />)

    unmount();

    await waitFor(() => expect(subscription.unsubscribe).toHaveBeenCalled());
  });

  test('reset resets the field\'s value.', async () => {
    const expectedInvalidMessage = 'Field A is required.';
    const expectedValidMessage = 'Field is valid.';

    const template : RootFormTemplate = {
      fields : {
        fieldA : {
          defaultValue : '',
          syncValidators : [
            required(expectedInvalidMessage, expectedValidMessage)
          ]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useField } = useRootFormResult.current;
    const { result : useFieldResult } = renderHook(() => useField('fieldA'));
    
    const { updateValue, reset } = useFieldResult.current;

    updateValue('test');

    await waitFor(() => expect(useFieldResult.current.value).toBe('test'));
    expect(useFieldResult.current.validity).toBe(Validity.VALID_FINALIZABLE);
    expect(useFieldResult.current.modified).toBe(Modified.YES);
    expect(useFieldResult.current.messages).toStrictEqual([
      {
        text : expectedValidMessage,
        type : MessageType.VALID
      }
    ]);

    reset();

    await waitFor(() => expect(useFieldResult.current.value).toBe(''));
    expect(useFieldResult.current.validity).toBe(Validity.INVALID);
    expect(useFieldResult.current.visited).toBe(Visited.NO);
    expect(useFieldResult.current.modified).toBe(Modified.NO);
    expect(useFieldResult.current.messages).toStrictEqual([
      {
        text : expectedInvalidMessage,
        type : MessageType.INVALID
      }
    ]);
  });
});