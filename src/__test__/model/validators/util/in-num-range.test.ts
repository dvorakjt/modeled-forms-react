import { describe, test, expect } from 'vitest';
import { inNumRange } from '../../../../model';

describe('inNumRange', () => {
  test('With default options, it returns an object with an isValid property set to true if the string can be converted to a number that is greater than the minimum and less than the maximum.', () => {
    const numStr = '3';
    expect(inNumRange(1, 5, '')(numStr)).toStrictEqual({
      isValid: true,
    });
  });

  test('With default options, it returns an object with an isValid property set to true if the string can be converted to a number that is equal to the minimum and less than the maximum.', () => {
    const numStr = '1';
    expect(inNumRange(1, 5, '')(numStr)).toStrictEqual({
      isValid: true,
    });
  });

  test('With default options, it returns an object with an isValid property set to true if the string can be converted to a number that is greater than the minimum and equal the maximum.', () => {
    const numStr = '5';
    expect(inNumRange(1, 5, '')(numStr)).toStrictEqual({
      isValid: true,
    });
  });

  test('With default options, it returns an object with an isValid property set to false if the string can be converted to a number that is less than the minimum.', () => {
    const numStr = '0';
    expect(inNumRange(1, 5, 'test')(numStr)).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('With default options, it returns an object with an isValid property set to false if the string can be converted to a number that is greater than the maximum.', () => {
    const numStr = '6';
    expect(inNumRange(1, 5, 'test')(numStr)).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('It returns an object with an isValid property set to false if the string cannot be converted to a number.', () => {
    const notANumber = 'not a number';
    expect(inNumRange(1, 5, 'test')(notANumber)).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('If the maximum is less than the minumum, any number will always fail.', () => {
    expect(inNumRange(5, 1, 'test')('3')).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('With default options, it returns an object with an isValid property set to true if the string can be converted to a number that is equal to the min and the max, and the min is equal to the max.', () => {
    const numStr = '3';
    expect(inNumRange(3, 3, '')(numStr)).toStrictEqual({
      isValid: true,
    });
  });

  test('If exclusiveMin is set to true, it returns an object with an isValid property set to false if the string can be converted to a number that is equal to the min.', () => {
    expect(inNumRange(1, 5, 'test', { exclusiveMin: true })('1')).toStrictEqual(
      {
        isValid: false,
        message: 'test',
      },
    );
  });

  test('If exclusiveMax is set to true, it returns an object with an isValid property set to false if the string can be converted to a number that is equal to the max.', () => {
    expect(inNumRange(1, 5, 'test', { exclusiveMax: true })('5')).toStrictEqual(
      {
        isValid: false,
        message: 'test',
      },
    );
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    expect(
      inNumRange(1, 5, '', { successMessage: 'test success message' })('3'),
    ).toStrictEqual({
      isValid: true,
      message: 'test success message',
    });
  });
});
