import type { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';
import type { FormElementMap } from '../form-elements/form-element-map.type';

export type SyncAdapterFn<Fields extends FormElementMap, V> = (
  valueToAdapt: AggregatedStateChanges<Fields>,
) => V;
