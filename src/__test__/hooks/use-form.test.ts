import { describe, test, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useForm } from '../../hooks/use-form';
import { container } from '../../model/container';

describe('useForm()', () => {
  test("reset() resets the form's value.", async () => {
    const form = container.services.NestedFormTemplateParser.parseTemplate({
      fields: {
        fieldA: '',
      },
    });

    const { result } = renderHook(() => useForm(form));

    const { useField } = result.current;

    const { result: useFieldResult } = renderHook(() => useField('fieldA'));

    useFieldResult.current.updateValue('test');

    await waitFor(() => expect(useFieldResult.current.value).toBe('test'));

    result.current.reset();

    await waitFor(() => expect(useFieldResult.current.value).toBe(''));
  });
});
