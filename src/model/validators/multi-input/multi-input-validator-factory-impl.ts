import { autowire } from 'undecorated-di';
import { AggregatedStateChanges } from '../../aggregators/aggregated-state-changes.interface';
import { AsyncValidator } from '../async-validator.type';
import { SyncValidator } from '../sync-validator.type';
import { AsyncMultiInputValidator } from './async-multi-input-validator';
import {
  MultiInputValidatorFactory,
  MultiInputValidatorFactoryKey,
  MultiInputValidatorFactoryKeyType,
} from './multi-input-validator-factory.interface';
import { MultiInputValidator } from './multi-input-validator.interface';
import { SyncMultiInputValidator } from './sync-multi-input-validator';
import {
  AggregatorFactory,
  AggregatorFactoryKey,
} from '../../aggregators/aggregator-factory.interface';
import { FormElementDictionary } from '../../form-elements/form-element-dictionary.type';
import { ConfigLoader, ConfigLoaderKey } from '../../config-loader/config-loader.interface';

class MultiInputValidatorFactoryImpl implements MultiInputValidatorFactory {
  _aggregatorFactory: AggregatorFactory;
  _configLoader : ConfigLoader;

  constructor(aggregatorFactory: AggregatorFactory, configLoader : ConfigLoader) {
    this._aggregatorFactory = aggregatorFactory;
    this._configLoader = configLoader;
  }

  createSyncMultiInputValidator(
    validator: SyncValidator<AggregatedStateChanges>,
    fields: FormElementDictionary,
  ): MultiInputValidator {
    const multiFieldAggregator =
      this._aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new SyncMultiInputValidator(multiFieldAggregator, validator, this._configLoader.config);
  }
  createAsyncMultiInputValidator(
    validator: AsyncValidator<AggregatedStateChanges>,
    fields: FormElementDictionary,
    pendingMessage: string = this._configLoader.config.globalMessages
      .pendingAsyncMultiFieldValidator,
  ): MultiInputValidator {
    const multiFieldAggregator =
      this._aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new AsyncMultiInputValidator(
      multiFieldAggregator,
      validator,
      pendingMessage,
      this._configLoader.config
    );
  }
}

const MultiInputValidatorFactoryService = autowire<
  MultiInputValidatorFactoryKeyType,
  MultiInputValidatorFactory,
  MultiInputValidatorFactoryImpl
>(MultiInputValidatorFactoryImpl, MultiInputValidatorFactoryKey, [
  AggregatorFactoryKey,
  ConfigLoaderKey
]);

export { MultiInputValidatorFactoryImpl, MultiInputValidatorFactoryService };
