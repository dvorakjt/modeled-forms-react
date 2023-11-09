import { describe, test, expect } from 'vitest';
import { minLength } from '../../../../model';
import { container } from '../../../../model/container';

describe('minLength', () => {
  test("It returns an object with property isValid set to false if the provided string's length is less than the minimum length.", () => {
    const minimum = 1;
    const errorMessage = `The provided string must be at least ${minimum} characters long.`;

    expect(minLength(minimum, errorMessage)('')).toStrictEqual({
      isValid: false,
      message: errorMessage,
    });
  });

  test("It returns an object with property isValid set to true if the provided string's length is equal to the minimum length.", () => {
    expect(minLength(1, '')('a')).toStrictEqual({
      isValid: true,
    });
  });

  test("It returns an object with property isValid set to true if the provided string's length is greater than the minimum length.", () => {
    expect(minLength(1, '')('abcd')).toStrictEqual({
      isValid: true,
    });
  });

  test('It evaluates values after trimming if autoTrim is set to true in the config file.', () => {
    const minimum = 1;
    const errorMessage = `The provided string must be at least ${minimum} characters long.`;
    const willBeTrimmed = ' \t\n';

    expect(minLength(1, errorMessage)(willBeTrimmed)).toStrictEqual({
      isValid: false,
      message: errorMessage,
    });
  });

  test('It evaluates values without trimming if autoTrim is set to false in the config file.', () => {
    const configLoader = container.services.ConfigLoader;
    configLoader.config.autoTrim = false;

    const willNotBeTrimmed = ' \t\n';

    expect(minLength(1, '')(willNotBeTrimmed)).toStrictEqual({
      isValid: true,
    });

    configLoader.config.autoTrim = true;
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    const minimum = 1;
    const successMessage = `The provided string is at least ${minimum} character(s) long.`;

    expect(minLength(minimum, '', successMessage)('a')).toStrictEqual({
      isValid: true,
      message: successMessage,
    });
  });
});
