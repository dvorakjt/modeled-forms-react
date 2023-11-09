import { describe, test, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRootForm } from '../../hooks';
import { RootFormTemplate, required } from '../../model';

describe('useFirstNonValidFormElement()', () => {
  test('It returns a string representing the first non-valid form element or undefined if all form elements are valid, which updates as the first non-valid form element changes.', async () => {
    const template: RootFormTemplate = {
      fields: {
        fieldA: {
          defaultValue: '',
          syncValidators: [required('field A is required.')],
        },
        fieldB: {
          defaultValue: '',
          syncValidators: [required('field B is required.')],
        },
        fieldC: {
          defaultValue: '',
          syncValidators: [required('field C is required.')],
        },
      },
      submitFn: ({ value }) => new Promise(resolve => resolve(value)),
    };

    const { result: useRootFormResult } = renderHook(() =>
      useRootForm(template),
    );
    const { useFirstNonValidFormElement, useField } = useRootFormResult.current;
    const { result: useFirstNonValidFormElementResult } = renderHook(() =>
      useFirstNonValidFormElement(),
    );

    expect(useFirstNonValidFormElementResult.current).toBe('fieldA');

    const { result: useFieldAResult } = renderHook(() => useField('fieldA'));
    useFieldAResult.current.updateValue('some value');

    await waitFor(() =>
      expect(useFirstNonValidFormElementResult.current).toBe('fieldB'),
    );

    const { result: useFieldBResult } = renderHook(() => useField('fieldB'));
    useFieldBResult.current.updateValue('some other value');

    await waitFor(() =>
      expect(useFirstNonValidFormElementResult.current).toBe('fieldC'),
    );

    const { result: useFieldCResult } = renderHook(() => useField('fieldC'));
    useFieldCResult.current.updateValue('yet another value');

    await waitFor(() =>
      expect(useFirstNonValidFormElementResult.current).toBe(undefined),
    );
  });
});
