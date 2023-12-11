import { describe, test, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { renderPossiblyErrantHook } from '../testing-util/hooks/render-possibly-errant-hook';
import { useRootForm } from '../../hooks';
import { RootFormTemplate } from '../../model';

describe('useOmittableFormElement', () => {
  test('It throws an error when the field name it receives does not exist in the template.', () => {
    const template: RootFormTemplate = {
      fields: {
        someField: '',
      },
      submitFn: ({ value }) => new Promise(resolve => resolve(value)),
    };
    const { result: useRootFormResult } = renderHook(() =>
      useRootForm(template),
    );

    const { useOmittableFormElement } = useRootFormResult.current;

    const { errorDetected } = renderPossiblyErrantHook(() =>
      useOmittableFormElement('nonExistentField'),
    );

    expect(errorDetected).toBe(true);
  });

  test('It returns a boolean value that is updated when setOmitFormElement() is called.', async () => {
    const template: RootFormTemplate = {
      fields: {
        fieldA: {
          defaultValue: '',
          omitByDefault: true,
        },
      },
      submitFn: ({ value }) => new Promise(resolve => resolve(value)),
    };
    const { result: useRootFormResult } = renderHook(() =>
      useRootForm(template),
    );

    const { useOmittableFormElement } = useRootFormResult.current;

    const { result: useOmittableFormElementResult } = renderHook(() =>
      useOmittableFormElement('fieldA'),
    );

    expect(useOmittableFormElementResult.current.omitFormElement).toBe(true);

    useOmittableFormElementResult.current.setOmitFormElement(false);

    await waitFor(() =>
      expect(useOmittableFormElementResult.current.omitFormElement).toBe(false),
    );
  });
});
