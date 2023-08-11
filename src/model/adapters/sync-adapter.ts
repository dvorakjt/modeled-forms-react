import { ReplaySubject, type Subject } from 'rxjs';
import { logErrorInDevMode } from '../util/log-error-in-dev-mode';
import type { SyncAdapterFn } from './sync-adapter-fn.type';
import type { Adapter } from './adapter.interface';
import type { MultiFieldAggregator } from '../aggregators/multi-field-aggregator.interface';
import type { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';

export class SyncAdapter<V>
  implements Adapter<V>
{
  readonly stream: Subject<V>;
  readonly #aggregator: MultiFieldAggregator;

  constructor(
    adapterFn: SyncAdapterFn<V>,
    aggregator: MultiFieldAggregator
  ) {
    this.#aggregator = aggregator;
    this.stream = new ReplaySubject<V>(1);
    this.#aggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges) => {
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
