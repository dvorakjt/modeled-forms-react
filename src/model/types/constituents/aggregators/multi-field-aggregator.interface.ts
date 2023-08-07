import type { Subject } from 'rxjs';
import type { FormElementMap } from '../form-elements/form-element-map.type';
import type { AggregatedStateChanges } from './aggregated-state-changes.interface';
import { OneTimeValueEmitter } from '../emitters/one-time-value-emitter.interface';

export interface MultiFieldAggregator<Fields extends FormElementMap> {
  aggregateChanges: Subject<AggregatedStateChanges<Fields>>;
  accessedFields : OneTimeValueEmitter<Set<string>>;
}
