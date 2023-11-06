import { describe, test, expect } from 'vitest';
import { getMessageId } from '../../../components/util/get-message-id';

describe('getMessageId()', () => {
  test('It appends the index to the field\'s message id prefix.', () => {
    const fieldName = 'someField';
    const index = 0;

    expect(getMessageId(fieldName, index)).toBe(`${fieldName}-messages-${index}`);
  });
});