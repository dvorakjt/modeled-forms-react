import { describe, test, expect } from 'vitest';
import { getRadioInputId } from '../../../components/util/get-radio-input-id';

describe('getRadioInputId()', () => {
  test('It returns the fieldName and value separated by a hyphen.', () => {
    const fieldName = 'someField';
    const value = 'someValue';

    expect(getRadioInputId(fieldName, value)).toBe(fieldName + '-' + value);
  });
});
