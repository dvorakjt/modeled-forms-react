import { describe, test, expect } from 'vitest';
import { includesSymbol } from '../../../../model';

const symbols = "!\"#$%&'()*+,-./\\:;<=>?@[]^_`{|}~".split('');

describe('includesSymbol', () => {
  test('It returns an object with an isValid property set to true if the evaluated string includes a symbol.', () => {
    for(const symbol of symbols) {
      expect(includesSymbol('')(symbol)).toStrictEqual({
        isValid : true
      });
    }
  });

  test('It accepts internal whitespace as a symbol when autoTrim is true in the config file.', () => {
    expect(includesSymbol('')('a b')).toStrictEqual({
      isValid : true
    });
  });
});