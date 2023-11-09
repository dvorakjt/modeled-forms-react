import { describe, test, expect } from 'vitest';
import { required } from '../../../../model';
import { container } from '../../../../model/container';

describe('required', () => {
  test('The function it returns returns an object with property isValid set to false when the provided string is empty.', () => {
    expect(required('test message')('')).toStrictEqual({
      isValid: false,
      message: 'test message',
    });
  });

  test('The function it returns returns an object with property isValid set to false when the provided string contains only white space and autoTrim is true in the config file.', () => {
    expect(required('test message')('   \t\t\t   \n\n')).toStrictEqual({
      isValid: false,
      message: 'test message',
    });
  });

  test('The function it returns returns an object with property isValid set to true when the provided string contains only white space and autoTrim is true in the config file.', () => {
    const configLoader = container.services.ConfigLoader;
    configLoader.config.autoTrim = false;
    expect(required('test message')('   \t\t\t   \n\n')).toStrictEqual({
      isValid: true,
    });
    configLoader.config.autoTrim = true;
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    expect(required('', 'test success message')('test')).toStrictEqual({
      isValid: true,
      message: 'test success message',
    });
  });
});
