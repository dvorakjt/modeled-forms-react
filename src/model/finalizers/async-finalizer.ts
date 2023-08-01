import { AsyncAdapter } from "../adapters/async-adapter";
import { MultiFieldAggregator } from "../types/aggregators/multi-field-aggregator.interface";
import { AsyncFinalizerFn } from "../types/finalizers/async-finalizer-fn.type";
import { Finalizer } from "../types/finalizers/finalizer.interface";
import { FormElementMap } from "../types/form-elements/form-element-map.type";
import { FinalizerState } from "../types/state/finalizer-state.interface";
import { ManagedObservableFactory } from "../types/subscriptions/managed-observable-factory.interface";

export class AsyncFinalizer<Fields extends FormElementMap> extends AsyncAdapter<Fields, FinalizerState> implements Finalizer {
  constructor(
    finalizerFn : AsyncFinalizerFn<Fields>,
    aggregator: MultiFieldAggregator<Fields>,
    managedObservableFactory: ManagedObservableFactory,
  ) {
    super(finalizerFn, aggregator, managedObservableFactory);
  }
} 