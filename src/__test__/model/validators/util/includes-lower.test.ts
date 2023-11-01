import { describe, test, expect } from 'vitest';
import { includesLower } from '../../../../model';

describe('includesLower', () => {
  test('It returns an object with an isValid property set to true if the string includes a lowercase letter.', () => {
    expect(includesLower('')('abcdefg')).toStrictEqual({
      isValid : true
    })
  });

  test('It returns an object with an isValid property set to false if the string does not include a lowercase letter.', () => {
    expect(includesLower('test message')('ABCDEFG 123456789 !?#$%')).toStrictEqual({
      isValid : false,
      message : 'test message'
    })
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    expect(includesLower('', 'test success message')('abcdefg')).toStrictEqual({
      isValid : true,
      message : 'test success message'
    });
  });
});