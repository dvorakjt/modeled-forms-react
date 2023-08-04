import { ReplaySubject, type Subject } from 'rxjs';
import { logErrorInDevMode } from '../util/log-error-in-dev-mode';
import type { SyncAdapterFn } from '../types/adapters/sync-adapter-fn.type';
import type { Adapter } from '../types/adapters/adapter.interface';
import type { MultiFieldAggregator } from '../types/aggregators/multi-field-aggregator.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { AggregatedStateChanges } from '../types/aggregators/aggregated-state-changes.interface';

export class SyncAdapter<Fields extends FormElementMap, V>
  implements Adapter<V>
{
  readonly stream: Subject<V>;
  readonly #aggregator: MultiFieldAggregator<Fields>;

  constructor(
    adapterFn: SyncAdapterFn<Fields, V>,
    aggregator: MultiFieldAggregator<Fields>
  ) {
    this.#aggregator = aggregator;
    this.stream = new ReplaySubject<V>(1);
    this.#aggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges<Fields>) => {
        try {
          const nextValue = adapterFn(aggregateChange); //adapters can return no value
          this.stream.next(nextValue);
        } catch (e) {
          logErrorInDevMode(e);
          this.stream.error(e);
        }
      }
    );
  }
}
