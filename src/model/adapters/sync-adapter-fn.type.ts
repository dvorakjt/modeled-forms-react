import type { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';

export type SyncAdapterFn<V> = (valueToAdapt: AggregatedStateChanges) => V;
