import { autowire } from 'undecorated-di';
import {
  AutoTransformer,
  AutoTransformerKey,
} from '../../auto-transforms/auto-transformer.interface';
import { AbstractField } from '../base/abstract-field';
import { AutoTransformedField } from './auto-transformed-field';
import {
  AutoTransformedFieldFactory,
  AutoTransformedFieldFactoryKey,
  AutoTransformedFieldFactoryKeyType,
} from './auto-transformed-field-factory.interface';

class AutoTransformedFieldFactoryImpl implements AutoTransformedFieldFactory {
  _autoTransformer: AutoTransformer;

  constructor(autoTransformer: AutoTransformer) {
    this._autoTransformer = autoTransformer;
  }

  createAutoTransformedField(baseField: AbstractField): AutoTransformedField {
    return new AutoTransformedField(baseField, this._autoTransformer);
  }
}

const AutoTransformedFieldFactoryService = autowire<
  AutoTransformedFieldFactoryKeyType,
  AutoTransformedFieldFactory,
  AutoTransformedFieldFactoryImpl
>(AutoTransformedFieldFactoryImpl, AutoTransformedFieldFactoryKey, [
  AutoTransformerKey,
]);

export { AutoTransformedFieldFactoryImpl, AutoTransformedFieldFactoryService };
