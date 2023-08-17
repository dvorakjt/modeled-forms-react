import { FormElementMap } from "../form-elements/form-element-map.type";
import { MultiInputValidator } from "../validators/multi-input/multi-input-validator.interface";
import { MultiFieldAggregator } from "./multi-field-aggregator.interface";
import { MultiInputValidatorMessagesAggregator } from "./multi-input-validator-messages-aggregator.interface";

export interface AggregatorFactory {
  createMultiFieldAggregatorFromFields(fields : FormElementMap) : MultiFieldAggregator;
  createMultiInputValidatorMessagesAggregatorFromValidators(validators : Array<MultiInputValidator>) : MultiInputValidatorMessagesAggregator;
}

export const AggregatorFactoryKey = 'AggregatorFactory';

export type AggregatorFactoryKeyType = typeof AggregatorFactoryKey;