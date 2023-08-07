import type { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';
import type { FormElementMap } from '../form-elements/form-element-map.type';

export type AsyncBaseFinalizerFn<Fields extends FormElementMap> = (
  valueToAdapt: AggregatedStateChanges<Fields>,
) => Promise<any>;
