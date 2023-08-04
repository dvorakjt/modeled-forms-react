import { SyncAdapter } from "../adapters/sync-adapter";
import { MultiFieldAggregator } from "../types/aggregators/multi-field-aggregator.interface";
import { Finalizer } from "../types/finalizers/finalizer.interface";
import { SyncFinalizerFn } from "../types/finalizers/sync-finalizer-fn.type";
import { FormElementMap } from "../types/form-elements/form-element-map.type";
import { FinalizerState } from "../types/state/finalizer-state.interface";

export class SyncFinalizer<Fields extends FormElementMap> extends SyncAdapter<Fields, FinalizerState> implements Finalizer {
  constructor(
    finalizerFn : SyncFinalizerFn<Fields>,
    aggregator: MultiFieldAggregator<Fields>
  ) {
    super(finalizerFn, aggregator);
  }
}