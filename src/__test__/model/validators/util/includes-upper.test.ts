import { describe, test, expect } from 'vitest';
import { includesUpper } from '../../../../model';

describe('includesUpper', () => {
  test('It returns an object with an isValid property set to true if the string includes an uppercase letter.', () => {
    expect(includesUpper('')('ABCDEFG')).toStrictEqual({
      isValid : true
    })
  });

  test('It returns an object with an isValid property set to false if the string does not include an uppercase letter.', () => {
    expect(includesUpper('test message')('abcdefg 123456789 !?#$%')).toStrictEqual({
      isValid : false,
      message : 'test message'
    })
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    expect(includesUpper('', 'test success message')('ABCDEFG')).toStrictEqual({
      isValid : true,
      message : 'test success message'
    });
  });
});