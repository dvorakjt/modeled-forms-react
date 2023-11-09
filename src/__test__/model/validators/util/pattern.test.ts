import { describe, test, expect } from 'vitest';
import { pattern } from '../../../../model';
import { container } from '../../../../model/container';

describe('pattern', () => {
  test('The function it returns returns an object with property isValid set to false when the provided string does not match the provided regular expression.', () => {
    const beginsWithAVowel = /^[aeiou]/i;

    expect(
      pattern(
        beginsWithAVowel,
        'The string does not begin with a vowel.',
      )('test'),
    ).toStrictEqual({
      isValid: false,
      message: 'The string does not begin with a vowel.',
    });
  });

  test('The function it returns returns an object with property isValid set to true when the provided string matches the provided regular expression.', () => {
    const beginsWithAConsonant = /^[bcdfghjklmnpqrstvwxyz]/i;

    expect(
      pattern(
        beginsWithAConsonant,
        'The string does not begin with a consonant.',
      )('test'),
    ).toStrictEqual({
      isValid: true,
    });
  });

  test('It evaluates the provided string after trimming it if autoTrim is set to true in the config file.', () => {
    const doesNotBeginOrEndWithWhiteSpace = /^\S.*\S$/;

    expect(
      pattern(
        doesNotBeginOrEndWithWhiteSpace,
        'The string begins or ends with whitespace.',
      )('   \t\t\thello world   \n\n'),
    ).toStrictEqual({
      isValid: true,
    });
  });

  test('It evaluates the provided string without trimming it if autoTrim is set to false in the config file.', () => {
    const configLoader = container.services.ConfigLoader;
    configLoader.config.autoTrim = false;

    const doesNotBeginOrEndWithWhiteSpace = /^\S.*\S$/;

    expect(
      pattern(
        doesNotBeginOrEndWithWhiteSpace,
        'The string begins or ends with whitespace.',
      )('   \t\t\thello world   \n\n'),
    ).toStrictEqual({
      isValid: false,
      message: 'The string begins or ends with whitespace.',
    });

    configLoader.config.autoTrim = true;
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    const passingRegex = /.*/;

    expect(pattern(passingRegex, '', 'test success message')('')).toStrictEqual(
      {
        isValid: true,
        message: 'test success message',
      },
    );
  });
});
