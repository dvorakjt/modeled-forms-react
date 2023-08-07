import { FormElementMap } from "../form-elements/form-element-map.type";
import { MultiInputValidator } from "../validators/multi-input/multi-input-validator.interface";
import { MultiFieldAggregator } from "./multi-field-aggregator.interface";
import { MultiInputValidatorMessagesAggregator } from "./multi-input-validator-messages-aggregator.interface";

export interface AggregatorFactory {
  createMultiFieldAggregatorFromFields<Fields extends FormElementMap>(fields : Fields) : MultiFieldAggregator<Fields>;
  createMultiInputValidatorMessagesAggregatorFromValidators(validators : Array<MultiInputValidator>) : MultiInputValidatorMessagesAggregator;
}