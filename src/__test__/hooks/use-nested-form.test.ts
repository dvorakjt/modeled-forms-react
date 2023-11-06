import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { renderPossiblyErrantHook } from '../util/hooks/render-possibly-errant-hook';
import { useRootForm } from '../../hooks';
import { RootFormTemplate } from '../../model';

describe('useNestedForm', () => {
  test('It throws an error if the field name is not found in the template.', () => {
    const template : RootFormTemplate = {
      fields : {
        someNestedForm : {
          fields : {
            fieldA : ''
          }
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const { result : useRootFormResult } = renderHook(() => useRootForm(template));

    const { useNestedForm } = useRootFormResult.current;

    const { errorDetected } = renderPossiblyErrantHook(() => useNestedForm('nonExistentNestedForm'));

    expect(errorDetected).toBe(true);
  });

  test('It throws an error if the field name does not represent a nested form.', () => {
    const template : RootFormTemplate = {
      fields : {
        notANestedForm : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const { result : useRootFormResult } = renderHook(() => useRootForm(template));

    const { useNestedForm } = useRootFormResult.current;

    const { errorDetected } = renderPossiblyErrantHook(() => useNestedForm('notANestedForm'));

    expect(errorDetected).toBe(true);
  });

  test('It returns useForm, passing in the nestedForm created by the template parser.', () => {
    const template : RootFormTemplate = {
      fields : {
        someNestedForm : {
          fields : {
            fieldA : ''
          }
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    
    const { result : useRootFormResult } = renderHook(() => useRootForm(template));

    const { useNestedForm } = useRootFormResult.current;

    const { result : useNestedFormResult } = renderHook(() => useNestedForm('someNestedForm'));

    expect(typeof useNestedFormResult.current.useFormState).toBe('function');
    expect(typeof useNestedFormResult.current.useField).toBe('function');
    expect(typeof useNestedFormResult.current.useDualField).toBe('function');
    expect(typeof useNestedFormResult.current.useNestedForm).toBe('function');
    expect(typeof useNestedFormResult.current.useOmittableFormElement).toBe('function');
    expect(typeof useNestedFormResult.current.useExtractedValue).toBe('function');
    expect(typeof useNestedFormResult.current.useFirstNonValidFormElement).toBe('function');
    expect(typeof useNestedFormResult.current.useDualField).toBe('function');
  });
});