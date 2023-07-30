import { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';
import { FormElementMap } from '../form-elements/form-element-map.type';

export interface AggregatedStateChangesProxyProducer {
  get accessedFieldNames(): Set<string>;
  getProxy<Fields extends FormElementMap>(
    fields: Fields,
  ): AggregatedStateChanges<Fields>;
  clear(): void;
}
