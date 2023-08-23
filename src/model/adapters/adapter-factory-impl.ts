import { autowire } from 'undecorated-di';
import {
  AdapterFactory,
  AdapterFactoryKey,
  AdapterFactoryKeyType,
} from './adapter-factory.interface';
import { AsyncAdapterFn } from './async-adapter-fn.type';
import { SyncAdapterFn } from './sync-adapter-fn.type';
import {
  AggregatorFactory,
  AggregatorFactoryKey,
} from '../aggregators/aggregator-factory.interface';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import { AsyncAdapter } from './async-adapter';
import { SyncAdapter } from './sync-adapter';

class AdapterFactoryImpl implements AdapterFactory {
  readonly #aggregatorFactory: AggregatorFactory;

  constructor(aggregatorFactory: AggregatorFactory) {
    this.#aggregatorFactory = aggregatorFactory;
  }

  createSyncAdapterFromFnWithFields<V>(
    syncAdapterFn: SyncAdapterFn<V>,
    fields: FormElementDictionary,
  ): SyncAdapter<V> {
    const multiFieldAggregator =
      this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new SyncAdapter(syncAdapterFn, multiFieldAggregator);
  }
  createAsyncAdapterFromFnWithFields<V>(
    asyncAdapterFn: AsyncAdapterFn<V>,
    fields: FormElementDictionary,
  ): AsyncAdapter<V> {
    const multiFieldAggregator =
      this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new AsyncAdapter(asyncAdapterFn, multiFieldAggregator);
  }
}

const AdapterFactoryService = autowire<
  AdapterFactoryKeyType,
  AdapterFactory,
  AdapterFactoryImpl
>(AdapterFactoryImpl, AdapterFactoryKey, [AggregatorFactoryKey]);

export { AdapterFactoryImpl, AdapterFactoryService };
