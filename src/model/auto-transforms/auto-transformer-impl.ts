import { autowire } from 'undecorated-di';
import { ConfigLoader, ConfigLoaderKey } from '../config-loader/config-loader.interface';

import {
  AutoTransformer,
  AutoTransformerKey,
  AutoTransformerKeyType,
} from './auto-transformer.interface';

class AutoTransformerImpl implements AutoTransformer {
  configLoader : ConfigLoader;

  constructor(configLoader : ConfigLoader) {
    this.configLoader = configLoader;
  }

  transform(value: string): string {
    if (this.configLoader.config.autoTrim) value = value.trim();

    return value;
  }
}

const AutoTransformerService = autowire<
  AutoTransformerKeyType,
  AutoTransformer,
  AutoTransformerImpl
>(AutoTransformerImpl, AutoTransformerKey, [ ConfigLoaderKey ]);

export { AutoTransformerImpl, AutoTransformerService };
