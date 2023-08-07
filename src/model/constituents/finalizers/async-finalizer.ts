import { AsyncAdapter } from "../adapters/async-adapter";
import type { MultiFieldAggregator } from "../../types/constituents/aggregators/multi-field-aggregator.interface";
import type { AsyncFinalizerFn } from "../../types/constituents/finalizers/async-finalizer-fn.type";
import type { Finalizer } from "../../types/constituents/finalizers/finalizer.interface";
import type { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import type { FinalizerState } from "../../types/constituents/state/finalizer-state.interface";

export class AsyncFinalizer<Fields extends FormElementMap> extends AsyncAdapter<Fields, FinalizerState> implements Finalizer {
  constructor(
    finalizerFn : AsyncFinalizerFn<Fields>,
    aggregator: MultiFieldAggregator<Fields>,
  ) {
    super(finalizerFn, aggregator);
  }
} 