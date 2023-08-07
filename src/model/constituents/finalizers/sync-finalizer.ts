import { SyncAdapter } from "../adapters/sync-adapter";
import { MultiFieldAggregator } from "../../types/constituents/aggregators/multi-field-aggregator.interface";
import { Finalizer } from "../../types/constituents/finalizers/finalizer.interface";
import { SyncFinalizerFn } from "../../types/constituents/finalizers/sync-finalizer-fn.type";
import { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import { FinalizerState } from "../../types/constituents/state/finalizer-state.interface";

export class SyncFinalizer<Fields extends FormElementMap> extends SyncAdapter<Fields, FinalizerState> implements Finalizer {
  constructor(
    finalizerFn : SyncFinalizerFn<Fields>,
    aggregator: MultiFieldAggregator<Fields>
  ) {
    super(finalizerFn, aggregator);
  }
}