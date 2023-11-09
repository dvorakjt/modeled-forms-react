import { describe, test, expect } from 'vitest';
import { maxDate } from '../../../../model';

describe('maxDate', () => {
  test('It returns an object with isValid property set to false if the date is later than the provided maximum.', () => {
    const maximum = new Date('1955-04-27');
    const testDate = '1955-09-21';
    const errorMessage = `The provided date is later than ${maximum.toLocaleDateString()}.`;

    expect(maxDate(maximum, errorMessage)(testDate)).toStrictEqual({
      isValid: false,
      message: errorMessage,
    });
  });

  test('It returns an object with isValid property set to true if the date is equal to the provided maximum.', () => {
    const maximum = new Date('1955-09-21');
    const testDate = '1955-09-21';

    expect(maxDate(maximum, '')(testDate)).toStrictEqual({
      isValid: true,
    });
  });

  test('It returns an object with isValid property set to true if the date is before the provided maximum.', () => {
    const maximum = new Date('1955-09-21');
    const testDate = '1955-04-27';

    expect(maxDate(maximum, '')(testDate)).toStrictEqual({
      isValid: true,
    });
  });

  test('It returns an object with isValid property set to false if the provided string cannot be converted to a date.', () => {
    const maximum = new Date('1955-04-27');
    const errorMessage = 'Please pass in a date.';
    const notADate = 'not a date';

    expect(maxDate(maximum, errorMessage)(notADate)).toStrictEqual({
      isValid: false,
      message: errorMessage,
    });
  });

  test('It returns an object with message set to successMessage if successMessage is provided and the test string passes.', () => {
    const maximum = new Date('1955-09-21');
    const testDate = '1955-04-27';
    const successMessage = 'The passed date is valid.';

    expect(maxDate(maximum, '', successMessage)(testDate)).toStrictEqual({
      isValid: true,
      message: successMessage,
    });
  });
});
