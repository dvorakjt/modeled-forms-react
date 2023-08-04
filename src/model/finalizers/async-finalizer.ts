import { AsyncAdapter } from "../adapters/async-adapter";
import type { MultiFieldAggregator } from "../types/aggregators/multi-field-aggregator.interface";
import type { AsyncFinalizerFn } from "../types/finalizers/async-finalizer-fn.type";
import type { Finalizer } from "../types/finalizers/finalizer.interface";
import type { FormElementMap } from "../types/form-elements/form-element-map.type";
import type { FinalizerState } from "../types/state/finalizer-state.interface";

export class AsyncFinalizer<Fields extends FormElementMap> extends AsyncAdapter<Fields, FinalizerState> implements Finalizer {
  constructor(
    finalizerFn : AsyncFinalizerFn<Fields>,
    aggregator: MultiFieldAggregator<Fields>,
  ) {
    super(finalizerFn, aggregator);
  }
} 