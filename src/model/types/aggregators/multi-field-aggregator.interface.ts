import type { ManagedSubject } from '../subscriptions/managed-subject.interface';
import type { FormElementMap } from '../form-elements/form-element-map.type';
import type { AggregatedStateChanges } from './aggregated-state-changes.interface';
import { OneTimeValueEmitter } from '../subscriptions/one-time-value-emitter.interface';

export interface MultiFieldAggregator<Fields extends FormElementMap> {
  aggregateChanges: ManagedSubject<AggregatedStateChanges<Fields>>;
  accessedFields : OneTimeValueEmitter<Set<string>>;
}
