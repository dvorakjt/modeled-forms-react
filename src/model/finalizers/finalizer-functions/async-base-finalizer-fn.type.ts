import type { AggregatedStateChanges } from '../../aggregators/aggregated-state-changes.interface';

export type AsyncBaseFinalizerFn = (
  valueToAdapt: AggregatedStateChanges,
) => Promise<any>;
