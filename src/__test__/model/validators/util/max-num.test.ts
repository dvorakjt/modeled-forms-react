import { describe, test, expect } from 'vitest';
import { maxNum } from '../../../../model';

describe('maxNum', () => {
  test('It returns an object with property isValid set to false if the provided string can be converted to a number and is greater than the maximum.', () => {
    const number = '100';
    const errorMessage = 'The number is greater than the provided maximum.';
    expect(maxNum(1, errorMessage)(number)).toStrictEqual({
      isValid: false,
      message: errorMessage,
    });
  });

  test('It returns an object with property isValid set to true if the provided string can be converted to a number and is equal to the maximum.', () => {
    const number = '1';
    expect(maxNum(1, '')(number)).toStrictEqual({
      isValid: true,
    });
  });

  test('It returns an object with property isValid set to true if the provided string can be converted to a number and is less than the maximum.', () => {
    const number = '1';
    expect(maxNum(2, '')(number)).toStrictEqual({
      isValid: true,
    });
  });

  test('It returns an object with property isValid set to false if the provided string cannot be converted to a number.', () => {
    const notANumber = 'not a number';
    const errorMessage =
      'You must provide a number whose value is less than or equal to the provided maximum.';
    expect(maxNum(100, errorMessage)(notANumber)).toStrictEqual({
      isValid: false,
      message: errorMessage,
    });
  });

  test('It returns an object with property isValid set to true if the provided string consists of a number surrounded by whitespace characters and is less than or equal to the maximum.', () => {
    const number = '   1    ';
    expect(maxNum(100, '')(number)).toStrictEqual({
      isValid: true,
    });
  });

  test('If the provided string passes and a success message was provided, it returns an object with a message property set to the provided success message.', () => {
    const number = '1';
    const successMessage =
      'The provided number was less than or equal to the maximum.';
    expect(maxNum(100, '', successMessage)(number)).toStrictEqual({
      isValid: true,
      message: successMessage,
    });
  });
});
