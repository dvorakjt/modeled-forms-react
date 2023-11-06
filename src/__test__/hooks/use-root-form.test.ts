import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRootForm } from '../../hooks';
import { RootFormTemplate } from '../../model';

const formTemplate : RootFormTemplate = {
  fields : {
    basicField : '',
    dualField : {
      primaryDefaultValue : '',
      secondaryDefaultValue : ''
    },
    nestedForm : {
      fields : {
        fieldA : '',
        fieldB : ''
      }
    }
  },
  extractedValues : {
    syncExtractedValues : {
      myValue : ({ basicField }) => basicField.value
    }
  },
  submitFn : ({ value }) => {
    return new Promise((resolve) => {
      resolve(value);
    });
  }
}

describe('useRootForm()', () => {
  test('It returns useFormState().', () => {
    const { result } = renderHook(() => useRootForm(formTemplate));
    const { useFormState } = result.current;
    expect(typeof useFormState).toBe('function');
  });

  test('It returns useField().', () => {
    const { result } = renderHook(() => useRootForm(formTemplate));
    const { useField } = result.current;
    expect(typeof useField).toBe('function');
  });

  test('It returns useDualField().', () => {
    const { result } = renderHook(() => useRootForm(formTemplate));
    const { useDualField } = result.current;
    expect(typeof useDualField).toBe('function');
  });

  test('It returns useNestedForm().', () => {
    const { result } = renderHook(() => useRootForm(formTemplate));
    const { useNestedForm } = result.current;
    expect(typeof useNestedForm).toBe('function');
  });

  test('It returns useOmittableFormElement().', () => {
    const { result } = renderHook(() => useRootForm(formTemplate));
    const { useOmittableFormElement } = result.current;
    expect(typeof useOmittableFormElement).toBe('function');
  });

  test('It returns useExtractedValue().', () => {
    const { result } = renderHook(() => useRootForm(formTemplate));
    const { useExtractedValue } = result.current;
    expect(typeof useExtractedValue).toBe('function');
  });

  test('It returns useFirstNonValidFormElement().', () => {
    const { result } = renderHook(() => useRootForm(formTemplate));
    const { useFirstNonValidFormElement } = result.current;
    expect(typeof useFirstNonValidFormElement).toBe('function');
  });

  test('It returns reset().', () => {
    const { result } = renderHook(() => useRootForm(formTemplate));
    const { reset } = result.current;
    expect(typeof reset).toBe('function');
  });
});




