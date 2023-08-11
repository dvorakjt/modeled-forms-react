import type { Observable } from 'rxjs';
import type { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';

export type AsyncAdapterFn<V> = (
  valueToAdapt: AggregatedStateChanges,
) => Promise<V> | Observable<V>;
