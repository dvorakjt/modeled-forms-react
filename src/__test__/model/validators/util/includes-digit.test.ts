import { describe, test, expect } from 'vitest';
import { includesDigit } from '../../../../model';

describe('includesDigit', () => {
  test('It returns an object with an isValid property set to true if the string includes a digit.', () => {
    for (let i = 0; i <= 9; i++) {
      expect(includesDigit('')(i.toString())).toStrictEqual({
        isValid: true,
      });
    }
  });

  test('It returns an object with an isValid property set to false if the string does not include a digit.', () => {
    expect(includesDigit('test message')('hello world')).toStrictEqual({
      isValid: false,
      message: 'test message',
    });
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    expect(includesDigit('', 'test success message')('9')).toStrictEqual({
      isValid: true,
      message: 'test success message',
    });
  });
});
