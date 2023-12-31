import { describe, test, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { renderPossiblyErrantHook } from '../testing-util/hooks/render-possibly-errant-hook';
import { useRootForm } from '../../hooks';
import { RootFormTemplate } from '../../model';

describe('useExtractedValue()', () => {
  test('It throws an error if the provided key does not exist in the template.', () => {
    const template: RootFormTemplate = {
      fields: {
        fieldA: '',
        fieldB: '',
      },
      submitFn: ({ value }) => new Promise(resolve => resolve(value)),
    };
    const { result: useRootFormResult } = renderHook(() =>
      useRootForm(template),
    );
    const { useExtractedValue } = useRootFormResult.current;

    const { errorDetected } = renderPossiblyErrantHook(() =>
      useExtractedValue('nonExistentExtractedValueKey'),
    );

    expect(errorDetected).toBe(true);
  });

  test('It returns a value that is generated by the provided function when a syncExtractedValue is provided.', () => {
    const template: RootFormTemplate = {
      fields: {
        favoriteColor: 'red',
      },
      extractedValues: {
        syncExtractedValues: {
          favColorShade: ({ favoriteColor }) => 'dark ' + favoriteColor.value,
        },
      },
      submitFn: ({ value }) => new Promise(resolve => resolve(value)),
    };

    const { result: useRootFormResult } = renderHook(() =>
      useRootForm(template),
    );
    const { useExtractedValue } = useRootFormResult.current;

    const { result } = renderHook(() => useExtractedValue('favColorShade'));

    expect(result.current).toBe('dark red');
  });

  test('It returns a value that is updated by the provided function when a asyncExtractedValue is provided.', async () => {
    const template: RootFormTemplate = {
      fields: {
        favoriteColor: 'red',
      },
      extractedValues: {
        asyncExtractedValues: {
          favColorCompliment: ({ favoriteColor }) => {
            const compliments = {
              red: 'green',
              blue: 'orange',
              yellow: 'purple',
              green: 'red',
              orange: 'blue',
              purple: 'yellow',
            };

            return new Promise(resolve =>
              resolve(
                compliments[favoriteColor.value as keyof typeof compliments],
              ),
            );
          },
        },
      },
      submitFn: ({ value }) => new Promise(resolve => resolve(value)),
    };

    const { result: useRootFormResult } = renderHook(() =>
      useRootForm(template),
    );
    const { useExtractedValue } = useRootFormResult.current;

    const { result } = renderHook(() =>
      useExtractedValue('favColorCompliment'),
    );

    await waitFor(() => expect(result.current).toBe('green'));
  });
});
