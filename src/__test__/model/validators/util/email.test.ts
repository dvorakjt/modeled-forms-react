import { describe, test, expect } from 'vitest';
import { email } from '../../../../model';
import { container } from '../../../../model/container';

const validEmailAddresses = [
  'email@example.com',
  'firstname.lastname@example.com',
  'email@subdomain.example.com',
  'firstname+lastname@example.com',
  '1234567890@example.com',
  'email@example-one.com',
  'email@example.name',
  'email@example.museum',
  'email@example.co.jp',
  'firstname-lastname@example.com'
]

const invalidEmailAddresses = [
  'plainaddress',
  '#@%^%#$@#$@#.com',
  '@example.com',
  'Joe Smith <email@example.com>',
  'email.example.com',
  'email@example@example.com',
  '.email@example.com',
  'email.@example.com',
  'email..email@example.com',
  'あいうえお@example.com',
  'email@example.com (Joe Smith)',
  'email@example',
  'email@-example.com',
  'email@111.222.333.44444',
  'email@example..com',
  'Abc..123@example.com'
]

describe('email', () => {
  test('It returns an object with an isValid property set to true for valid email addresses.', () => {
    for(const addr of validEmailAddresses) {
      expect(email('')(addr)).toStrictEqual({
        isValid : true
      });
    }
  });

  test('It returns an object with an isValid property set to false for invalid email addresses.', () => {
    for(const addr of invalidEmailAddresses) {
      expect(email('test')(addr)).toStrictEqual({
        isValid : false,
        message : 'test'
      });
    }
  });

  test('It trims values before evaluation if autoTrim is true in the config file.', () => {
    const addressWithWhiteSpace = '   user@example.com   ';
    expect(email('')(addressWithWhiteSpace)).toStrictEqual({
      isValid : true
    })
  });

  test('It does not trim values before evaluation if autoTrim is false in the config file.', () => {
    const configLoader = container.services.ConfigLoader;
    configLoader.config.autoTrim = false;

    const addressWithWhiteSpace = '   user@example.com   ';
    expect(email('test')(addressWithWhiteSpace)).toStrictEqual({
      isValid : false,
      message : 'test'
    });

    configLoader.config.autoTrim = true;
  });

  test('If a success message is supplied and the evaluated string passes, the test message is return.', () => {
    const successMessage = 'success';
    expect(email('', successMessage)(validEmailAddresses[0])).toStrictEqual({
      isValid : true,
      message : successMessage
    });
  });

  test('The regular expression used for evaluating an email address is configurable.', () => {
    const configLoader = container.services.ConfigLoader;
    const tempEmailRegex = configLoader.config.emailRegex;
    configLoader.config.emailRegex = /.*/;

    expect(email('')(invalidEmailAddresses[0])).toStrictEqual({
      isValid : true
    });

    configLoader.config.emailRegex = tempEmailRegex;
  });
});