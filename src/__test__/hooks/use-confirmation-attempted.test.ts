import { describe, test, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRootForm } from '../../hooks';
import { RootFormTemplate } from '../../model';

describe('useConfirmationAttempted()', () => {
  test('It returns confirmationAttempted, which is updated to true when tryConfirm() is called.', async () => {
    const template: RootFormTemplate = {
      fields: {
        fieldA: '',
      },
      submitFn: ({ value }) => new Promise(resolve => resolve(value)),
    };

    const { result: useRootFormResult } = renderHook(() =>
      useRootForm(template),
    );

    const { result: useConfirmationAttemptedResult } = renderHook(() =>
      useRootFormResult.current.useConfirmationAttempted(),
    );

    expect(useConfirmationAttemptedResult.current).toBe(false);

    useRootFormResult.current.tryConfirm({});

    await waitFor(() =>
      expect(useConfirmationAttemptedResult.current).toBe(true),
    );
  });
});
