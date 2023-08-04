import { ReplaySubject, from, type Subscription, type Subject } from 'rxjs';
import { logErrorInDevMode } from '../util/log-error-in-dev-mode';
import type { MultiFieldAggregator } from '../types/aggregators/multi-field-aggregator.interface';
import type { Adapter } from '../types/adapters/adapter.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { AsyncAdapterFn } from '../types/adapters/async-adapter-fn.type';
import type { AggregatedStateChanges } from '../types/aggregators/aggregated-state-changes.interface';

export class AsyncAdapter<Fields extends FormElementMap, V>
  implements Adapter<V>
{
  readonly stream: Subject<V>;
  readonly #aggregator: MultiFieldAggregator<Fields>;
  #adapterFnSubscription?: Subscription;

  constructor(
    adapterFn: AsyncAdapterFn<Fields, V>,
    aggregator: MultiFieldAggregator<Fields>
  ) {
    this.#aggregator = aggregator;
    this.stream = new ReplaySubject<V>(1),
    this.#aggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges<Fields>) => {
        this.#adapterFnSubscription?.unsubscribe();
        try {
          const promiseOrObservable = adapterFn(aggregateChange);
          this.#adapterFnSubscription = from(promiseOrObservable)
          .subscribe({
            next: next => this.stream.next(next),
            error: e => {
              logErrorInDevMode(e);
              this.stream.error(e);
            },
          });
        } catch (e) {
          logErrorInDevMode(e);
          this.stream.error(e);
        }
      }
    );
  }
}