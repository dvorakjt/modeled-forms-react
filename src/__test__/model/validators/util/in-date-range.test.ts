import { describe, test, expect } from 'vitest';
import { inDateRange } from '../../../../model';

describe('inDateRange', () => {
  test('With default options, it returns an object with an isValid property set to true if the string can be converted to a Date that is greater than the minimum and less than the maximum.', () => {
    const dateStr = '1955-07-30';
    const min = new Date('1955-04-27');
    const max = new Date('1955-09-21');
    expect(inDateRange(min, max, '')(dateStr)).toStrictEqual({
      isValid: true,
    });
  });

  test('With default options, it returns an object with an isValid property set to true if the string can be converted to a date that is equal to the minimum and less than the maximum.', () => {
    const dateStr = '1955-04-27';
    const min = new Date(dateStr);
    const max = new Date('1955-09-21');
    expect(inDateRange(min, max, '')(dateStr)).toStrictEqual({
      isValid: true,
    });
  });

  test('With default options, it returns an object with an isValid property set to true if the string can be converted to a date that is greater than the minimum and equal the maximum.', () => {
    const dateStr = '1955-09-21';
    const min = new Date('1955-04-27');
    const max = new Date(dateStr);
    expect(inDateRange(min, max, '')(dateStr)).toStrictEqual({
      isValid: true,
    });
  });

  test('With default options, it returns an object with an isValid property set to false if the string can be converted to a date that is less than the minimum.', () => {
    const dateStr = '1955-04-27';
    const min = new Date('1955-07-30');
    const max = new Date('1955-09-21');
    expect(inDateRange(min, max, 'test')(dateStr)).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('With default options, it returns an object with an isValid property set to false if the string can be converted to a date that is greater than the maximum.', () => {
    const min = new Date('1955-04-27');
    const max = new Date('1955-07-30');
    const dateStr = '1955-09-21';
    expect(inDateRange(min, max, 'test')(dateStr)).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('It returns an object with an isValid property set to false if the string cannot be converted to a date.', () => {
    const notADate = 'not a date';
    const min = new Date('1955-04-27');
    const max = new Date('1955-09-21');
    expect(inDateRange(min, max, 'test')(notADate)).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('If the maximum is less than the minumum, any date will always fail.', () => {
    const before = new Date('1955-04-27');
    const after = new Date('1955-09-21');
    const dateStr = '1955-07-30';
    expect(inDateRange(after, before, 'test')(dateStr)).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('With default options, it returns an object with an isValid property set to true if the string can be converted to a date that is equal to the min and the max, and the min is equal to the max.', () => {
    const dateStr = '1955-09-21';
    const min = new Date(dateStr);
    const max = new Date(dateStr);
    expect(inDateRange(min, max, '')(dateStr)).toStrictEqual({
      isValid: true,
    });
  });

  test('If exclusiveMin is set to true, it returns an object with an isValid property set to false if the string can be converted to a date that is equal to the min.', () => {
    const dateStr = '1955-04-27';
    const min = new Date(dateStr);
    const max = new Date('1955-09-21');
    expect(
      inDateRange(min, max, 'test', { exclusiveMin: true })(dateStr),
    ).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('If exclusiveMax is set to true, it returns an object with an isValid property set to false if the string can be converted to a date that is equal to the max.', () => {
    const dateStr = '1955-09-21';
    const min = new Date('1955-04-27');
    const max = new Date(dateStr);
    expect(
      inDateRange(min, max, 'test', { exclusiveMax: true })(dateStr),
    ).toStrictEqual({
      isValid: false,
      message: 'test',
    });
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    const dateStr = '1955-07-30';
    const min = new Date('1955-04-27');
    const max = new Date('1955-09-21');
    expect(
      inDateRange(min, max, '', { successMessage: 'test success message' })(
        dateStr,
      ),
    ).toStrictEqual({
      isValid: true,
      message: 'test success message',
    });
  });
});
