import type { Observable } from 'rxjs';
import type { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';
import type { FormElementMap } from '../form-elements/form-element-map.type';

export type AsyncAdapterFn<Fields extends (FormElementMap), V> = (
  valueToAdapt: AggregatedStateChanges<Fields>,
) => Promise<V> | Observable<V>;
