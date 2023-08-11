import { SyncAdapter } from "../adapters/sync-adapter";
import { MultiFieldAggregator } from "../aggregators/multi-field-aggregator.interface";
import { Finalizer } from "./finalizer.interface";
import { SyncFinalizerFn } from "./finalizer-functions/sync-finalizer-fn.type";
import { FinalizerState } from "../state/finalizer-state.interface";

export class SyncFinalizer extends SyncAdapter<FinalizerState> implements Finalizer {
  constructor(
    finalizerFn : SyncFinalizerFn,
    aggregator: MultiFieldAggregator
  ) {
    super(finalizerFn, aggregator);
  }
}