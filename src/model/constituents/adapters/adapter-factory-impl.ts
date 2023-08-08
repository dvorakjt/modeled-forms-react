import { AdapterFactory } from "../../types/constituents/adapters/adapter-factory.interface";
import { AsyncAdapterFn } from "../../types/constituents/adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../../types/constituents/adapters/sync-adapter-fn.type";
import { AggregatorFactory } from "../../types/constituents/aggregators/aggregator-factory.interface";
import { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import { AsyncAdapter } from "./async-adapter";
import { SyncAdapter } from "./sync-adapter";

export class AdapterFactoryImpl implements AdapterFactory {
  readonly #aggregatorFactory : AggregatorFactory;

  constructor(aggregatorFactory : AggregatorFactory) {
    this.#aggregatorFactory = aggregatorFactory;
  }

  createSyncAdapterFromFnWithFields<Fields extends FormElementMap, V>(syncAdapterFn: SyncAdapterFn<Fields, V>, fields: Fields): SyncAdapter<Fields, V> {
    const multiFieldAggregator = this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new SyncAdapter(syncAdapterFn, multiFieldAggregator);
  }
  createAsyncAdapterFromFnWithFields<Fields extends FormElementMap, V>(asyncAdapterFn: AsyncAdapterFn<Fields, V>, fields: Fields): AsyncAdapter<Fields, V> {
    const multiFieldAggregator = this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new AsyncAdapter(asyncAdapterFn, multiFieldAggregator);
  }
  
}