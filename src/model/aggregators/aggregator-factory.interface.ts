import { FormElementMap } from '../form-elements/form-element-map.type';
import { MultiInputValidator } from '../validators/multi-input/multi-input-validator.interface';
import { MultiFieldAggregator } from './multi-field-aggregator.interface';
import { MultiInputValidatorMessagesAggregator } from './multi-input-validator-messages-aggregator.interface';

interface AggregatorFactory {
  createMultiFieldAggregatorFromFields(
    fields: FormElementMap,
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