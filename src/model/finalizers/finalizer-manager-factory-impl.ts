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

class FinalizerManagerFactoryImpl implements FinalizerManagerFactory {
  _reducerFactory: ReducerFactory;
  _finalizerValidityTranslator: FinalizerValidityTranslator;

  constructor(
    reducerFactory: ReducerFactory,
    finalizerValidityTranslator: FinalizerValidityTranslator,
  ) {
    this._reducerFactory = reducerFactory;
    this._finalizerValidityTranslator = finalizerValidityTranslator;
  }

  createFinalizerManager(
    finalizerDictionary: FinalizerDictionary,
  ): FinalizerManager {
    const finalizerValidityReducer =
      this._reducerFactory.createFinalizerValidityReducer();
    const visitationReducer = this._reducerFactory.createVisitationReducer();
    const modificationReducer = this._reducerFactory.createModificationReducer();
    return new FinalizerManagerImpl(
      finalizerDictionary,
      finalizerValidityReducer,
      this._finalizerValidityTranslator,
      visitationReducer,
      modificationReducer
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
]);

export { FinalizerManagerFactoryImpl, FinalizerManagerFactoryService };
