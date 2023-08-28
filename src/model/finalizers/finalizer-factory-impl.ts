import { autowire } from 'undecorated-di';
import {
  AggregatorFactory,
  AggregatorFactoryKey,
} from '../aggregators/aggregator-factory.interface';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import { StatefulFormElement } from '../form-elements/stateful-form-element.interface';
import { AsyncFinalizer } from './async-finalizer';
import { DefaultFinalizer } from './default-finalizer';
import {
  FinalizerFactory,
  FinalizerFactoryKey,
  FinalizerFactoryKeyType,
} from './finalizer-factory.interface';
import { AsyncFinalizerFn } from './finalizer-functions/async-finalizer-fn.type';
import { SyncFinalizerFn } from './finalizer-functions/sync-finalizer-fn.type';
import {
  FinalizerValidityTranslator,
  FinalizerValidityTranslatorKey,
} from './finalizer-validity-translator.interface';
import { SyncFinalizer } from './sync-finalizer';

class FinalizerFactoryImpl implements FinalizerFactory {
  #aggregatorFactory: AggregatorFactory;
  #finalizerValidityTranslator: FinalizerValidityTranslator;

  constructor(
    aggregatorFactory: AggregatorFactory,
    finalizerValidityTranslator: FinalizerValidityTranslator,
  ) {
    this.#aggregatorFactory = aggregatorFactory;
    this.#finalizerValidityTranslator = finalizerValidityTranslator;
  }

  createSyncFinalizer(
    finalizerFn: SyncFinalizerFn,
    fields: FormElementDictionary,
  ): SyncFinalizer {
    const aggregator =
      this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new SyncFinalizer(finalizerFn, aggregator);
  }
  createAsyncFinalizer(
    finalizerFn: AsyncFinalizerFn,
    fields: FormElementDictionary,
  ): AsyncFinalizer {
    const aggregator =
      this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new AsyncFinalizer(finalizerFn, aggregator);
  }
  createDefaultFinalizer(
    baseField: StatefulFormElement<any>,
  ): DefaultFinalizer {
    return new DefaultFinalizer(baseField, this.#finalizerValidityTranslator);
  }
}

const FinalizerFactoryService = autowire<
  FinalizerFactoryKeyType,
  FinalizerFactory,
  FinalizerFactoryImpl
>(FinalizerFactoryImpl, FinalizerFactoryKey, [
  AggregatorFactoryKey,
  FinalizerValidityTranslatorKey,
]);

export { FinalizerFactoryImpl, FinalizerFactoryService };
