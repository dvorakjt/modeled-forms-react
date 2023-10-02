import { describe, test, expect } from 'vitest';
import { minNum } from '../../../../model/validators/util/min-num';

describe('minNum', () => {
  test('It returns an object with property isValid set to false if the provided string can be converted to a number and is less than the minimum.', () => {
    const number = '1';
    const errorMessage = 'The number is less than the provided minimum.'
    expect(minNum(2, errorMessage)(number)).toStrictEqual({
      isValid : false,
      message : errorMessage
    });
  });

  test('It returns an object with property isValid set to true if the provided string can be converted to a number and is equal to the minimum.', () => {
    const number = '1';
    expect(minNum(1, '')(number)).toStrictEqual({
      isValid : true
    });
  });

  test('It returns an object with property isValid set to true if the provided string can be converted to a number and is greater than the minimum.', () => {
    const number = '2';
    expect(minNum(1, '')(number)).toStrictEqual({
      isValid : true
    });
  });

  test('It returns an object with property isValid set to false if the provided string cannot be converted to a number.', () => {
    const notANumber = 'not a number';
    const errorMessage = 'You must provide a number whose value is greater than or equal to the provided minimum.';
    expect(minNum(1, errorMessage)(notANumber)).toStrictEqual({
      isValid : false,
      message : errorMessage
    });
  });

  test('It returns an object with property isValid set to true if the provided string consists of a number surrounded by whitespace characters and is greater than or equal to the minimum.', () => {
    const number = '   2    ';
    expect(minNum(1, '')(number)).toStrictEqual({
      isValid : true
    });
  });

  test('If the provided string passes and a success message was provided, it returns an object with a message property set to the provided success message.', () => {
    const number = '100';
    const successMessage = 'The provided number was greater than or equal to the minimum.';
    expect(minNum(1, '', successMessage)(number)).toStrictEqual({
      isValid : true,
      message : successMessage
    });
  });
});