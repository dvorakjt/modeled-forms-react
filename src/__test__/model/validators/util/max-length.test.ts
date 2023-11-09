import { describe, test, expect } from 'vitest';
import { maxLength } from '../../../../model';
import { container } from '../../../../model/container';

describe('maxLength', () => {
  test("It returns an object with property isValid set to false if the provided string's length is greater than the maximum length.", () => {
    const maximum = 1;
    const errorMessage = `The provided string must be less than or equal to ${maximum} characters long.`;

    expect(maxLength(maximum, errorMessage)('ab')).toStrictEqual({
      isValid: false,
      message: errorMessage,
    });
  });

  test("It returns an object with property isValid set to true if the provided string's length is equal to the maximum length.", () => {
    expect(maxLength(1, '')('a')).toStrictEqual({
      isValid: true,
    });
  });

  test("It returns an object with property isValid set to true if the provided string's length is less than the maximum length.", () => {
    expect(maxLength(1, '')('')).toStrictEqual({
      isValid: true,
    });
  });

  test('It evaluates values after trimming if autoTrim is set to true in the config file.', () => {
    const willBeTrimmed = ' \t\n';

    expect(maxLength(1, '')(willBeTrimmed)).toStrictEqual({
      isValid: true,
    });
  });

  test('It evaluates values without trimming if autoTrim is set to false in the config file.', () => {
    const configLoader = container.services.ConfigLoader;
    configLoader.config.autoTrim = false;

    const willNotBeTrimmed = ' \t\n';
    const maximum = 1;
    const errorMessage = `The provided string must be no more than ${maximum} characters long.`;

    expect(maxLength(maximum, errorMessage)(willNotBeTrimmed)).toStrictEqual({
      isValid: false,
      message: errorMessage,
    });

    configLoader.config.autoTrim = true;
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    const maximum = 1;
    const successMessage = `The provided string is no more than ${maximum} character(s) long.`;

    expect(maxLength(maximum, '', successMessage)('a')).toStrictEqual({
      isValid: true,
      message: successMessage,
    });
  });
});
