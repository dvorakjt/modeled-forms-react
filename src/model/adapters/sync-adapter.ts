import { ReplaySubject } from 'rxjs';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { SyncAdapterFn } from '../types/adapters/sync-adapter-fn.type';
import type { Adapter } from '../types/adapters/adapter.interface';
import type { MultiFieldAggregator } from '../types/aggregators/multi-field-aggregator.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { AggregatedStateChanges } from '../types/aggregators/aggregated-state-changes.interface';
import { logErrorInDevMode } from '../util/log-error-in-dev-mode';

export class SyncAdapter<Fields extends FormElementMap, V>
  implements Adapter<V>
{
  readonly stream: ManagedSubject<V>;
  readonly #aggregator: MultiFieldAggregator<Fields>;

  constructor(
    adapterFn: SyncAdapterFn<Fields, V>,
    aggregator: MultiFieldAggregator<Fields>,
    managedObservableFactory: ManagedObservableFactory,
  ) {
    this.#aggregator = aggregator;
    this.stream = managedObservableFactory.createManagedSubject(
      new ReplaySubject<V>(1),
    );
    this.#aggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges<Fields>) => {
        try {
          const nextValue = adapterFn(aggregateChange); //adapters can return no value
          this.stream.next(nextValue);
        } catch (e) {
          logErrorInDevMode(e);
          this.stream.error(e);
        }
      },
    );
  }
}
