import { describe, test, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { renderPossiblyErrantHook } from "../util/hooks/render-possibly-errant-hook";
import { useRootForm } from "../../hooks";
import { MessageType, RootFormTemplate, Validity, maxLength } from "../../model";
import { Modified } from "../../model/state/modified.enum";
import { Visited } from "../../model/state/visited.enum";

const invalidMessage = 'max length is 1';
const validMessage = 'field is under the max length';

const template : RootFormTemplate = {
  fields : {
    dualField : {
      primaryDefaultValue : 'primary',
      secondaryDefaultValue : 'secondary',
      syncValidators : [maxLength(1, invalidMessage, validMessage)]
    },
    notADualField : ''
  },
  submitFn : ({ value }) => new Promise((resolve) => resolve(value))
}

describe('useDualField()', () => {
  test('An error is thrown if the field name does not exist in the template.', () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    
    const { errorDetected } = renderPossiblyErrantHook(() => useDualField('someNonExistentField'));

    expect(errorDetected).toBe(true);
  });

  test('An error is thrown if the field name does not represent a dual field.', () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    
    const { errorDetected } = renderPossiblyErrantHook(() => useDualField('notADualField'));

    expect(errorDetected).toBe(true);
  });

  test('An error is NOT thrown if the field name represents a dual field.', () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    
    const { errorDetected } = renderPossiblyErrantHook(() => useDualField('dualField'));

    expect(errorDetected).toBe(false);
  });

  test('It returns usePrimaryField().', () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    const { result : useDualFieldResult } = renderHook(() => useDualField('dualField'));
    const { usePrimaryField } = useDualFieldResult.current;
    expect(typeof usePrimaryField).toBe('function');
  });

  test('usePrimaryField() returns useField, passing in the field created from the template.', async () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    const { result : useDualFieldResult } = renderHook(() => useDualField('dualField'));
    const { usePrimaryField } = useDualFieldResult.current;
    const { result : usePrimaryFieldResult } = renderHook(() => usePrimaryField());
    const { value, validity, messages, modified, updateValue, visit, reset } = usePrimaryFieldResult.current;

    expect(value).toBe('primary');
    expect(validity).toBe(Validity.INVALID);
    expect(messages).toStrictEqual([
      {
        text : invalidMessage,
        type : MessageType.INVALID
      }
    ]);
    expect(modified).toBe(Modified.YES);

    expect(typeof visit).toBe('function');

    visit();

    await waitFor(() => expect(usePrimaryFieldResult.current.visited).toBe(Visited.YES));

    expect(typeof updateValue).toBe('function');
    expect(typeof reset).toBe('function');
  });

  test('It returns useSecondaryField().', () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    const { result : useDualFieldResult } = renderHook(() => useDualField('dualField'));
    const { useSecondaryField } = useDualFieldResult.current;
    expect(typeof useSecondaryField).toBe('function');
  });

  test('useSecondaryField() returns useField, passing in the field created from the template.', async () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    const { result : useDualFieldResult } = renderHook(() => useDualField('dualField'));
    const { useSecondaryField } = useDualFieldResult.current;
    const { result : useSecondaryFieldResult } = renderHook(() => useSecondaryField());
    const { value, validity, messages, modified, updateValue, visit, reset } = useSecondaryFieldResult.current;

    expect(value).toBe('secondary');
    expect(validity).toBe(Validity.INVALID);
    expect(messages).toStrictEqual([
      {
        text : invalidMessage,
        type : MessageType.INVALID
      }
    ]);
    expect(modified).toBe(Modified.YES);

    expect(typeof visit).toBe('function');

    visit();

    await waitFor(() => expect(useSecondaryFieldResult.current.visited).toBe(Visited.YES));

    expect(typeof updateValue).toBe('function');
    expect(typeof reset).toBe('function');
  });


  test('It returns useSwitchToSecondaryField().', () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    const { result : useDualFieldResult } = renderHook(() => useDualField('dualField'));
    const { useSwitchToSecondaryField } = useDualFieldResult.current;
    expect(typeof useSwitchToSecondaryField).toBe('function');
  });

  test('It returns reset().', () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    const { result : useDualFieldResult } = renderHook(() => useDualField('dualField'));
    const { reset } = useDualFieldResult.current;
    expect(typeof reset).toBe('function');
  });

  test('reset() resets the field.', async () => {
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));
    const { useDualField } = useRootFormResult.current;
    const { result : useDualFieldResult } = renderHook(() => useDualField('dualField'));
    const { usePrimaryField, useSecondaryField, useSwitchToSecondaryField, reset } = useDualFieldResult.current;

    const { result : usePrimaryFieldResult } = renderHook(() => usePrimaryField());
    const { result : useSecondaryFieldResult } = renderHook(() => useSecondaryField());
    const { result : useSwitchToSecondaryFieldResult } = renderHook(() => useSwitchToSecondaryField());

    usePrimaryFieldResult.current.updateValue('updated primary field');
    
    await waitFor(() => expect(usePrimaryFieldResult.current.value).toBe('updated primary field'));

    useSecondaryFieldResult.current.updateValue('updated secondary field');

    await waitFor(() => expect(useSecondaryFieldResult.current.value).toBe('updated secondary field'));

    useSwitchToSecondaryFieldResult.current.setUseSecondaryField(true);

    await waitFor(() => expect(useSwitchToSecondaryFieldResult.current.useSecondaryField).toBe(true));

    reset();

    await waitFor(() => expect(usePrimaryFieldResult.current.value).toBe('primary'));
    expect(useSecondaryFieldResult.current.value).toBe('secondary');
    expect(useSwitchToSecondaryFieldResult.current.useSecondaryField).toBe(false);
  });
});