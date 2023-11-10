import { AsyncValidator } from '../async-validator.type';
import {
  SingleInputValidatorSuiteFactoryKey,
  SingleInputValidatorSuiteFactoryKeyType,
  SingleInputValidatorSuiteFactory,
} from './single-input-validator-suite-factory.interface';
import { SingleInputValidatorSuite } from './single-input-validator-suite.interface';
import { SyncValidator } from '../sync-validator.type';
import { AsyncSingleInputValidatorSuite } from './async-single-input-validator-suite';
import { HybridSingleInputValidatorSuite } from './hybrid-single-input-validator-suite';
import { SyncSingleInputValidatorSuite } from './sync-single-input-validator-suite';
import { autowire } from 'undecorated-di';
import { ConfigLoader, ConfigLoaderKey } from '../../config-loader/config-loader.interface';

class SingleInputValidatorSuiteFactoryImpl
  implements SingleInputValidatorSuiteFactory
{
  _configLoader : ConfigLoader;

  constructor(configLoader : ConfigLoader) {
    this._configLoader = configLoader;
  }

  createSingleInputValidatorSuite<T>(
    syncValidators: SyncValidator<T>[],
    asyncValidators: AsyncValidator<T>[],
    pendingAsyncValidatorMessage: string = this._configLoader.config.globalMessages
      .pendingAsyncValidatorSuite,
  ): SingleInputValidatorSuite<T> {
    const syncValidatorSuite = new SyncSingleInputValidatorSuite(
      syncValidators,
      this._configLoader.config
    );
    if (asyncValidators.length > 0) {
      const asyncValidatorSuite = new AsyncSingleInputValidatorSuite(
        asyncValidators,
        pendingAsyncValidatorMessage,
        this._configLoader.config
      );
      if (syncValidators.length > 0)
        return new HybridSingleInputValidatorSuite(
          syncValidatorSuite,
          asyncValidatorSuite,
        );
      else return asyncValidatorSuite;
    } else return syncValidatorSuite;
  }
}

const SingleInputValidatorSuiteFactoryService = autowire<
  SingleInputValidatorSuiteFactoryKeyType,
  SingleInputValidatorSuiteFactory,
  SingleInputValidatorSuiteFactoryImpl
>(SingleInputValidatorSuiteFactoryImpl, SingleInputValidatorSuiteFactoryKey, [
  ConfigLoaderKey
]);

export {
  SingleInputValidatorSuiteFactoryImpl,
  SingleInputValidatorSuiteFactoryService,
};
