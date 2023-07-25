import { ReplaySubject } from "rxjs";
import { ManagedSubject } from "../subscriptions/managed-subject";
import { SyncAdapterFn } from "../types/adapters/sync-adapter-fn.type";
import { Adapter } from "../types/adapters/adapter.interface";
import { MultiFieldAggregator } from "../types/aggregators/multi-field-aggregator.interface";
import { FormElementMap } from "../types/form-elements/form-element-map.type";
import { SubscriptionManager } from "../types/subscriptions/subscription-manager.interface";

export class SyncAdapter<Fields extends FormElementMap, V> implements Adapter<V> {
  stream : ManagedSubject<V>;
  #aggregator : MultiFieldAggregator<Fields>;
  constructor(
    adapterFn : SyncAdapterFn<Fields, V>, 
    aggregator : MultiFieldAggregator<Fields>, 
    subscriptionManager : SubscriptionManager
  ) {
    this.#aggregator = aggregator;
    this.stream = subscriptionManager.registerSubject(new ReplaySubject<V>());
    this.#aggregator.aggregateChanges.subscribe(aggregateChange => {
      try {
        const nextValue = adapterFn(aggregateChange);
        this.stream.next(nextValue);
      } catch (e) {
        process.env.NODE_ENV === 'development' && console.error(e);
        this.stream.error(e);
      } 
    });
  }
} 