import { autowire } from 'undecorated-di';
import {
  SubmissionManagerFactory,
  SubmissionManagerFactoryKey,
  SubmissionManagerFactoryKeyType,
} from './submission-manager-factory.interface';
import {
  ConfigLoader,
  ConfigLoaderKey,
} from '../config-loader/config-loader.interface';
import { SubmissionManagerImpl } from './submission-manager-impl';
import { SubmissionManager } from './submission-manager.interface';
import { SubmitFn } from './submit-fn.type';

class SubmissionManagerFactoryImpl implements SubmissionManagerFactory {
  _configLoader: ConfigLoader;

  constructor(configLoader: ConfigLoader) {
    this._configLoader = configLoader;
  }

  createSubmissionManager(submitFn: SubmitFn): SubmissionManager {
    return new SubmissionManagerImpl(submitFn, this._configLoader.config);
  }
}

const SubmissionManagerFactoryService = autowire<
  SubmissionManagerFactoryKeyType,
  SubmissionManagerFactory,
  SubmissionManagerFactoryImpl
>(SubmissionManagerFactoryImpl, SubmissionManagerFactoryKey, [ConfigLoaderKey]);

export { SubmissionManagerFactoryImpl, SubmissionManagerFactoryService };
