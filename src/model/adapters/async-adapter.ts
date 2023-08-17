import { ReplaySubject, from, type Subscription, type Subject } from 'rxjs';
import { logErrorInDevMode } from '../util/log-error-in-dev-mode';
import type { MultiFieldAggregator } from '../aggregators/multi-field-aggregator.interface';
import type { Adapter } from './adapter.interface';
import type { AsyncAdapterFn } from './async-adapter-fn.type';
import type { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';

export class AsyncAdapter<V>
  implements Adapter<V>
{
  readonly stream: Subject<V>;
  readonly #aggregator: MultiFieldAggregator;
  #adapterFnSubscription?: Subscription;

  constructor(
    adapterFn: AsyncAdapterFn<V>,
    aggregator: MultiFieldAggregator
  ) {
    this.#aggregator = aggregator;
    this.stream = new ReplaySubject<V>(1),
    this.#aggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges) => {
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