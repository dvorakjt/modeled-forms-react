import { describe, test, expect } from 'vitest';
import { getMessageId } from '../../../components/util/get-message-id';
import { getAriaDescribedBy } from '../../../components/util/get-aria-described-by';
import { MessageType } from '../../../model';

describe('getAriaDescribedBy', () => {
  test('If it receives an empty array, it returns an empty string.', () => {
    expect(getAriaDescribedBy('someField', [])).toBe('');
  });

  test('It returns the message Ids for each message in the array separated by a space.', () => {
    const fieldName = 'someField';

    const expectedValue = `${getMessageId(fieldName, 0)} ${getMessageId(
      fieldName,
      1,
    )} ${getMessageId(fieldName, 2)}`;

    const messages = [
      {
        text: 'password is required',
        type: MessageType.INVALID,
      },
      {
        text: 'password must contain a lowercase letter',
        type: MessageType.INVALID,
      },
      {
        text: 'password must contain an uppercase letter',
        type: MessageType.INVALID,
      },
    ];

    expect(getAriaDescribedBy(fieldName, messages)).toBe(expectedValue);
  });
});
