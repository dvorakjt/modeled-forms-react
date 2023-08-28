import { autowire } from 'undecorated-di';
import { config } from '../../config';
import {
  AutoTransformer,
  AutoTransformerKey,
  AutoTransformerKeyType,
} from './auto-transformer.interface';

class AutoTransformerImpl implements AutoTransformer {
  transform(value: string): string {
    if (config.autoTrim) value = value.trim();

    return value;
  }
}

const AutoTransformerService = autowire<
  AutoTransformerKeyType,
  AutoTransformer,
  AutoTransformerImpl
>(AutoTransformerImpl, AutoTransformerKey);

export { AutoTransformerImpl, AutoTransformerService };
