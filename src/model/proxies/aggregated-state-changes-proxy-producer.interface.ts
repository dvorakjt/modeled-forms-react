import { AggregatedStateChanges } from '../aggregators/aggregated-state-changes.interface';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';

export interface AggregatedStateChangesProxyProducer {
  get accessedFieldNames(): Set<string>;
  getProxy<Fields extends FormElementDictionary>(
    fields: Fields,
  ): AggregatedStateChanges;
}
