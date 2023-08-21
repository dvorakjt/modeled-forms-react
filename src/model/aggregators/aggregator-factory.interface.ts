import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import { MultiInputValidator } from '../validators/multi-input/multi-input-validator.interface';
import { MultiFieldAggregator } from './multi-field-aggregator.interface';
import { MultiInputValidatorMessagesAggregator } from './multi-input-validator-messages-aggregator.interface';

interface AggregatorFactory {
  createMultiFieldAggregatorFromFields(
    fields: FormElementDictionary,
  ): MultiFieldAggregator;
  createMultiInputValidatorMessagesAggregatorFromValidators(
    validators: Array<MultiInputValidator>,
  ): MultiInputValidatorMessagesAggregator;
}
const AggregatorFactoryKey = 'AggregatorFactory';
type AggregatorFactoryKeyType = typeof AggregatorFactoryKey;

export {
  AggregatorFactoryKey,
  type AggregatorFactory,
  type AggregatorFactoryKeyType,
};
