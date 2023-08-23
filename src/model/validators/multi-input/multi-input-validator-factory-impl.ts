import { autowire } from "undecorated-di";
import { AggregatedStateChanges } from "../../aggregators/aggregated-state-changes.interface";
import { config } from "../../../config";
import { AsyncValidator } from "../async-validator.type";
import { SyncValidator } from "../sync-validator.type";
import { AsyncMultiInputValidator } from "./async-multi-input-validator";
import { MultiInputValidatorFactory, MultiInputValidatorFactoryKey, MultiInputValidatorFactoryKeyType } from "./multi-input-validator-factory.interface";
import { MultiInputValidator } from "./multi-input-validator.interface";
import { SyncMultiInputValidator } from "./sync-multi-input-validator";
import { AggregatorFactory, AggregatorFactoryKey } from "../../aggregators/aggregator-factory.interface";
import { FormElementDictionary } from "../../form-elements/form-element-dictionary.type";

class MultiInputValidatorFactoryImpl implements MultiInputValidatorFactory {
  #aggregatorFactory : AggregatorFactory;

  constructor(aggregatorFactory : AggregatorFactory) {
    this.#aggregatorFactory = aggregatorFactory;
  }

  createSyncMultiInputValidator(validator: SyncValidator<AggregatedStateChanges>, fields : FormElementDictionary): MultiInputValidator {
    const multiFieldAggregator = this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new SyncMultiInputValidator(multiFieldAggregator, validator);
  }
  createAsyncMultiInputValidator(validator: AsyncValidator<AggregatedStateChanges>, fields : FormElementDictionary, pendingMessage : string = config.globalMessages.pendingAsyncMultiFieldValidator): MultiInputValidator {
    const multiFieldAggregator = this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new AsyncMultiInputValidator(multiFieldAggregator, validator, pendingMessage);
  }
}

const MultiInputValidatorFactoryService = autowire<MultiInputValidatorFactoryKeyType, MultiInputValidatorFactory, MultiInputValidatorFactoryImpl>(
  MultiInputValidatorFactoryImpl,
  MultiInputValidatorFactoryKey,
  [
    AggregatorFactoryKey
  ]
)

export { 
  MultiInputValidatorFactoryImpl, 
  MultiInputValidatorFactoryService };