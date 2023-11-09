import { describe, test, expect } from 'vitest';
import { includesSymbol } from '../../../../model';
import { container } from '../../../../model/container';

const symbols = '!"#$%&\'()*+,-./\\:;<=>?@[]^_`{|}~'.split('');

describe('includesSymbol', () => {
  test('It returns an object with an isValid property set to true if the evaluated string includes a symbol.', () => {
    for (const symbol of symbols) {
      expect(includesSymbol('')(symbol)).toStrictEqual({
        isValid: true,
      });
    }
  });

  test('It accepts internal whitespace as a symbol when autoTrim is true in the config file.', () => {
    expect(includesSymbol('')('a b')).toStrictEqual({
      isValid: true,
    });
  });

  test('It returns an object whose isValid property is set to false when it receives a string that does not contain a symbol.', () => {
    const str = 'ABCDefg0123456789';
    expect(includesSymbol('test message')(str)).toStrictEqual({
      isValid: false,
      message: 'test message',
    });
  });

  test('It trims the provided string before evaluating it if autoTrim is set to true in the config file.', () => {
    expect(includesSymbol('test message')(' ')).toStrictEqual({
      isValid: false,
      message: 'test message',
    });
  });

  test('It does not trim the provided string before evaluating it if autoTrim is set to false in the config file.', () => {
    const configLoader = container.services.ConfigLoader;
    configLoader.config.autoTrim = false;

    expect(includesSymbol('')(' ')).toStrictEqual({
      isValid: true,
    });

    configLoader.config.autoTrim = true;
  });

  test('It utilizes the regex provided in the config file.', () => {
    const configLoader = container.services.ConfigLoader;
    const tempSymbolRegex = configLoader.config.symbolRegex;
    configLoader.config.symbolRegex = /.*/;

    expect(includesSymbol('')('a')).toStrictEqual({
      isValid: true,
    });

    configLoader.config.symbolRegex = tempSymbolRegex;
  });

  test('When a success message is passed in as an argument, that message is returned should the provided string pass.', () => {
    expect(includesSymbol('', 'test success message')('!')).toStrictEqual({
      isValid: true,
      message: 'test success message',
    });
  });
});
