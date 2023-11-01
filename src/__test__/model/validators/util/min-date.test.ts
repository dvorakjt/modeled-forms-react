import { describe, test, expect } from 'vitest';
import { minDate } from '../../../../model';

describe('minDate', () => {
  test('It returns an object with isValid property set to false if the date is earlier than the provided minimum.', () => {
    const minimum = new Date('1955-09-21');
    const testDate = '1955-04-27';
    const errorMessage = `The provided date is earlier than ${minimum.toLocaleDateString()}.`;

    expect(minDate(minimum, errorMessage)(testDate)).toStrictEqual({
      isValid : false,
      message : errorMessage
    });
  });

  test('It returns an object with isValid property set to true if the date is equal to the provided minimum.', () => {
    const minimum = new Date('1955-09-21');
    const testDate = '1955-09-21';

    expect(minDate(minimum, '')(testDate)).toStrictEqual({
      isValid : true
    });
  });

  test('It returns an object with isValid property set to true if the date is after the provided minimum.', () => {
    const minimum = new Date('1955-04-27');
    const testDate = '1955-09-21';

    expect(minDate(minimum, '')(testDate)).toStrictEqual({
      isValid : true
    });
  });

  test('It returns an object with isValid property set to false if the provided string cannot be converted to a date.', () => {
    const minimum = new Date('1955-04-27');
    const errorMessage = 'Please pass in a date.';
    const notADate = 'not a date';

    expect(minDate(minimum, errorMessage)(notADate)).toStrictEqual({
      isValid : false,
      message : errorMessage
    });
  });

  test('It returns an object with message set to successMessage if successMessage is provided and the test string passes.', () => {
    const minimum = new Date('1955-04-27');
    const testDate = '1955-09-21';
    const successMessage = 'The passed date is valid.';

    expect(minDate(minimum, '', successMessage)(testDate)).toStrictEqual({
      isValid : true,
      message : successMessage
    });
  });
});