import { ReplaySubject, from } from "rxjs";
import type { MultiFieldAggregator } from "../types/aggregators/multi-field-aggregator.interface";
import { ManagedSubject } from "../subscriptions/managed-subject";
import { Adapter } from "../types/adapters/adapter.interface";
import { FormElementMap } from "../types/form-elements/form-element-map.type";
import { AsyncAdapterFn } from "../types/adapters/async-adapter-fn.type";
import { ManagedSubscription } from "../subscriptions/managed-subscription";
import { SubscriptionManager } from "../types/subscriptions/subscription-manager.interface";

export class AsyncAdapter<Fields extends FormElementMap, V> implements Adapter<V> {
  stream : ManagedSubject<V>;
  #aggregator : MultiFieldAggregator<Fields>;
  #adapterFnSubscription? : ManagedSubscription;

  constructor(
    aggregator : MultiFieldAggregator<Fields>, 
    adapterFn : AsyncAdapterFn<Fields, V>, 
    subscriptionManager : SubscriptionManager
  ) {
    this.#aggregator = aggregator;
    this.stream = subscriptionManager.registerSubject(new ReplaySubject<V>());
    this.#aggregator.aggregateChanges.subscribe(aggregateChange => {
      this.#adapterFnSubscription?.unsubscribe();
      this.#adapterFnSubscription = subscriptionManager.registerObservable(
        from(adapterFn(aggregateChange))  
      ).subscribe({
        next: next => this.stream.next(next),
        error : e => {
          process.env.NODE_ENV === 'development' && console.error(e);
          this.stream.error(e)
        }
      });
    });
  }
}