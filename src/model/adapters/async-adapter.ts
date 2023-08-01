import { ReplaySubject, from } from 'rxjs';
import type { MultiFieldAggregator } from '../types/aggregators/multi-field-aggregator.interface';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { Adapter } from '../types/adapters/adapter.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { AsyncAdapterFn } from '../types/adapters/async-adapter-fn.type';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';
import type { AggregatedStateChanges } from '../types/aggregators/aggregated-state-changes.interface';
import { logErrorInDevMode } from '../util/log-error-in-dev-mode';

export class AsyncAdapter<Fields extends FormElementMap, V>
  implements Adapter<V>
{
  readonly stream: ManagedSubject<V>;
  readonly #aggregator: MultiFieldAggregator<Fields>;
  #adapterFnSubscription?: ManagedSubscription;

  constructor(
    adapterFn: AsyncAdapterFn<Fields, V>,
    aggregator: MultiFieldAggregator<Fields>,
    managedObservableFactory: ManagedObservableFactory,
  ) {
    this.#aggregator = aggregator;
    this.stream = managedObservableFactory.createManagedSubject(
      new ReplaySubject<V>(1),
    );
    this.#aggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges<Fields>) => {
        this.#adapterFnSubscription?.unsubscribe();
        try {
          const promiseOrObservable = adapterFn(aggregateChange);
          this.#adapterFnSubscription = managedObservableFactory
          .createManagedObservable(from(promiseOrObservable))
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