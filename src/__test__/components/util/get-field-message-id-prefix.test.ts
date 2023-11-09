import { describe, test, expect } from 'vitest';
import { getFieldMessageIdPrefix } from '../../../components/util/get-field-message-id-prefix';

describe('getFieldMessageIdPrefix()', () => {
  test("It appends '-messages' to the fieldName.", () => {
    const fieldName = 'someField';
    const expectedValue = fieldName + '-messages';

    expect(getFieldMessageIdPrefix(fieldName)).toBe(expectedValue);
  });
});
