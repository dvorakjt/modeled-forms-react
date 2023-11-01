import { describe, test, expect } from 'vitest';
import { DEFAULT_SETTINGS } from '../../../config';
import { ConfigLoaderImpl } from '../../../model/config-loader/config-loader-impl';

describe('ConfigLoader', () => {
  test('It loads the default configuration settings.', () => {
    const configLoader = new ConfigLoaderImpl();
    expect(configLoader.config).toStrictEqual(DEFAULT_SETTINGS);
  });
});
