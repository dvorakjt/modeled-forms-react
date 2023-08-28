import { AbstractField } from '../base/abstract-field';
import { AutoTransformedField } from './auto-transformed-field';

interface AutoTransformedFieldFactory {
  createAutoTransformedField(baseField: AbstractField): AutoTransformedField;
}
const AutoTransformedFieldFactoryKey = 'AutoTransformedFieldFactory';
type AutoTransformedFieldFactoryKeyType = typeof AutoTransformedFieldFactoryKey;

export {
  AutoTransformedFieldFactoryKey,
  type AutoTransformedFieldFactory,
  type AutoTransformedFieldFactoryKeyType,
};
