import type { Subject } from 'rxjs';
import type { AggregatedStateChanges } from './aggregated-state-changes.interface';
import { OneTimeValueEmitter } from '../emitters/one-time-value-emitter.interface';

export interface MultiFieldAggregator {
  aggregateChanges: Subject<AggregatedStateChanges>;
  accessedFields : OneTimeValueEmitter<Set<string>>;
}
