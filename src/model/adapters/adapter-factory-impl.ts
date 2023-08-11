import { makeInjectable } from "../util/make-injectable";
import { Services } from "../container";
import { AdapterFactory } from "./adapter-factory.interface";
import { AsyncAdapterFn } from "./async-adapter-fn.type";
import { SyncAdapterFn } from "./sync-adapter-fn.type";
import { AggregatorFactory } from "../aggregators/aggregator-factory.interface";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { AsyncAdapter } from "./async-adapter";
import { SyncAdapter } from "./sync-adapter";

class AdapterFactoryImpl implements AdapterFactory {
  readonly #aggregatorFactory : AggregatorFactory;

  constructor(aggregatorFactory : AggregatorFactory) {
    this.#aggregatorFactory = aggregatorFactory;
  }

  createSyncAdapterFromFnWithFields<V>(syncAdapterFn: SyncAdapterFn<V>, fields: FormElementMap): SyncAdapter<V> {
    const multiFieldAggregator = this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new SyncAdapter(syncAdapterFn, multiFieldAggregator);
  }
  createAsyncAdapterFromFnWithFields<V>(asyncAdapterFn: AsyncAdapterFn<V>, fields: FormElementMap): AsyncAdapter<V> {
    const multiFieldAggregator = this.#aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new AsyncAdapter(asyncAdapterFn, multiFieldAggregator);
  }
}

makeInjectable(AdapterFactoryImpl, [Services.AggregatorFactory]);

export { AdapterFactoryImpl };