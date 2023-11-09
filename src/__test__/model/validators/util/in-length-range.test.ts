import { describe, test, expect } from 'vitest';
import { inLengthRange } from '../../../../model';
import { container } from '../../../../model/container';

describe('inNumRange', () => {
  test("With default options, it returns an object with an isValid property set to true if the string's length is greater than the min length and less than the max length.", () => {
    const str = 'abc';
    expect(inLengthRange(1, 5, '')(str)).toStrictEqual({
      isValid: true,
    });
  });

  test("With default options, it returns an object with an isValid property set to true if the string's length is equal to the min length and less than the max length.", () => {
    const str = 'a';
    expect(inLengthRange(1, 5, '')(str)).toStrictEqual({
      isValid: true,
    });
  });

  test("With default options, it returns an object with an isValid property set to true if the string's length is greater than the min length and equal to the max length.", () => {
    const str = 'abcde';
    expect(inLengthRange(1, 5, '')(str)).toStrictEqual({
      isValid: true,
    });
  });

  test("With default options, it returns an object with an isValid property set to false if the string's length is less than the min length.", () => {
    expect(inLengthRange(1, 5, 'test')('')).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test("With default options, it returns an object with an isValid property set to false if the string's length is greater than the max length.", () => {
    const str = 'abcdef';
    expect(inLengthRange(1, 5, 'test')(str)).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('If the max length is less than the min length, any string will always fail.', () => {
    expect(inLengthRange(5, 1, 'test')('abc')).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test("With default options, it returns an object with an isValid property set to true if the string's length is equal to the min length, which is equal to the max length.", () => {
    const str = 'abc';
    expect(inLengthRange(3, 3, '')(str)).toStrictEqual({
      isValid: true,
    });
  });

  test("If exclusiveMin is set to true, it returns an object with an isValid property set to false if the string's length is equal to the min length.", () => {
    expect(
      inLengthRange(1, 5, 'test', { exclusiveMin: true })('a'),
    ).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test("If exclusiveMax is set to true, it returns an object with an isValid property set to false if the string's length is equal to the max length.", () => {
    expect(
      inLengthRange(1, 5, 'test', { exclusiveMax: true })('abcde'),
    ).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    expect(
      inLengthRange(1, 5, '', { successMessage: 'test success message' })(
        'abc',
      ),
    ).toStrictEqual({
      isValid: true,
      message: 'test success message',
    });
  });

  test('When autoTrim is true in the config file, it trims the string before evaluating it.', () => {
    expect(inLengthRange(0, 1, '')(' \t\n')).toStrictEqual({
      isValid: true,
    });
  });

  test('When autoTrim is false in the config file, it does not trim the string before evaluating it.', () => {
    const configLoader = container.services.ConfigLoader;
    configLoader.config.autoTrim = false;

    expect(inLengthRange(0, 1, 'test')(' \t\n')).toStrictEqual({
      isValid: false,
      message: 'test',
    });

    configLoader.config.autoTrim = true;
  });
});
