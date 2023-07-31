import { ReplaySubject, from } from 'rxjs';
import type { MultiFieldAggregator } from '../types/aggregators/multi-field-aggregator.interface';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { Adapter } from '../types/adapters/adapter.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { AsyncAdapterFn } from '../types/adapters/async-adapter-fn.type';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { ManagedSubscription } from '../types/subscriptions/managed-subscription.interface';
import type { AggregatedStateChanges } from '../types/aggregators/aggregated-state-changes.interface';

export class AsyncAdapter<Fields extends FormElementMap, V>
  implements Adapter<V>
{
  readonly stream: ManagedSubject<V>;
  readonly #aggregator: MultiFieldAggregator<Fields>;
  #adapterFnSubscription?: ManagedSubscription;

  constructor(
    aggregator: MultiFieldAggregator<Fields>,
    adapterFn: AsyncAdapterFn<Fields, V>,
    managedObservableFactory: ManagedObservableFactory,
  ) {
    this.#aggregator = aggregator;
    this.stream = managedObservableFactory.createManagedSubject(
      new ReplaySubject<V>(),
    );
    this.#aggregator.aggregateChanges.subscribe(
      (aggregateChange: AggregatedStateChanges<Fields>) => {
        this.#adapterFnSubscription?.unsubscribe();
        this.#adapterFnSubscription = managedObservableFactory
          .createManagedObservable(from(adapterFn(aggregateChange)))
          .subscribe({
            next: next => this.stream.next(next),
            error: e => {
              process.env.NODE_ENV === 'development' && console.error(e);
              this.stream.error(e);
            },
          });
      },
    );
  }
}
