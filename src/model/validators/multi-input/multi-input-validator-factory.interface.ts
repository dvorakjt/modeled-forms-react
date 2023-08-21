import { AggregatedStateChanges } from "../../aggregators/aggregated-state-changes.interface";
import { FormElementDictionary } from "../../form-elements/form-element-dictionary.type";
import { AsyncValidator } from "../async-validator.type";
import { SyncValidator } from "../sync-validator.type";
import { MultiInputValidator } from "./multi-input-validator.interface";

interface MultiInputValidatorFactory {
  createSyncMultiInputValidator(validator: SyncValidator<AggregatedStateChanges>, fields : FormElementDictionary) : MultiInputValidator;
  createAsyncMultiInputValidator(validator : AsyncValidator<AggregatedStateChanges>, fields : FormElementDictionary, pendingMessage : string) : MultiInputValidator;
}
const MultiInputValidatorFactoryKey = 'MultiInputValidatorFactory';
type MultiInputValidatorFactoryKeyType = typeof MultiInputValidatorFactoryKey;

export { MultiInputValidatorFactoryKey, type MultiInputValidatorFactory, type MultiInputValidatorFactoryKeyType };