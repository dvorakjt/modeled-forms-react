import { autowire } from 'undecorated-di';
import {
  ReducerFactory,
  ReducerFactoryKey,
} from '../reducers/reducer-factory.interface';
import {
  FinalizerManagerFactory,
  FinalizerManagerFactoryKey,
  FinalizerManagerFactoryKeyType,
} from './finalizer-manager-factory.interface';
import { FinalizerManagerImpl } from './finalizer-manager-impl';
import { FinalizerManager } from './finalizer-manager.interface';
import { FinalizerDictionary } from './finalizer-map.type';
import {
  FinalizerValidityTranslator,
  FinalizerValidityTranslatorKey,
} from './finalizer-validity-translator.interface';
import { ConfigLoader, ConfigLoaderKey } from '../config-loader/config-loader.interface';

class FinalizerManagerFactoryImpl implements FinalizerManagerFactory {
  _reducerFactory: ReducerFactory;
  _finalizerValidityTranslator: FinalizerValidityTranslator;
  _configLoader : ConfigLoader

  constructor(
    reducerFactory: ReducerFactory,
    finalizerValidityTranslator: FinalizerValidityTranslator,
    configLoader : ConfigLoader
  ) {
    this._reducerFactory = reducerFactory;
    this._finalizerValidityTranslator = finalizerValidityTranslator;
    this._configLoader = configLoader
  }

  createFinalizerManager(
    finalizerDictionary: FinalizerDictionary,
  ): FinalizerManager {
    const finalizerValidityReducer =
      this._reducerFactory.createFinalizerValidityReducer();
    const visitationReducer = this._reducerFactory.createVisitationReducer();
    const modificationReducer =
      this._reducerFactory.createModificationReducer();
    const focusReducer = this._reducerFactory.createFocusReducer();

    return new FinalizerManagerImpl(
      finalizerDictionary,
      finalizerValidityReducer,
      this._finalizerValidityTranslator,
      visitationReducer,
      modificationReducer,
      focusReducer,
      this._configLoader.config
    );
  }
}

const FinalizerManagerFactoryService = autowire<
  FinalizerManagerFactoryKeyType,
  FinalizerManagerFactory,
  FinalizerManagerFactoryImpl
>(FinalizerManagerFactoryImpl, FinalizerManagerFactoryKey, [
  ReducerFactoryKey,
  FinalizerValidityTranslatorKey,
  ConfigLoaderKey
]);

export { FinalizerManagerFactoryImpl, FinalizerManagerFactoryService };
