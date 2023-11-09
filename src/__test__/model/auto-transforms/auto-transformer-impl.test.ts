import { AutoTransformerImpl } from '../../../model/auto-transforms/auto-transformer-impl';
import { describe, test, expect } from 'vitest';
import { MockConfigLoader } from '../../util/mocks/mock-config-loader';
import { container } from '../../../model/container';

describe('AutoTransformerImpl', () => {
  test('Using the default configuration, white space is removed.', () => {
    const autoTransformer = container.services.AutoTransformer;
    const value = '    hello world  ';
    expect(autoTransformer.transform(value)).toBe('hello world');
  });

  test('It removes white space from a supplied value if autoTrim is true.', () => {
    const configLoader = new MockConfigLoader({ autoTrim: true });
    const autoTransformer = new AutoTransformerImpl(configLoader);

    const value = '    hello world  ';
    expect(autoTransformer.transform(value)).toBe('hello world');
  });

  test('It does not remove white space from a supplied value if autoTrim is false.', () => {
    const configLoader = new MockConfigLoader({ autoTrim: false });
    const autoTransformer = new AutoTransformerImpl(configLoader);

    const value = '    hello world  ';
    expect(autoTransformer.transform(value)).toBe(value);
  });
});
