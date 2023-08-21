import { SyncAdapter } from '../adapters/sync-adapter';
import { MultiFieldAggregator } from '../aggregators/multi-field-aggregator.interface';
import { Finalizer } from './finalizer.interface';
import { SyncFinalizerFn } from './finalizer-functions/sync-finalizer-fn.type';
import { FinalizerState } from '../state/finalizer-state.interface';
import { AccessibleFields } from './accessible-fields.interface';
import { OneTimeValueEmitter } from '../emitters/one-time-value-emitter.interface';

export class SyncFinalizer
  extends SyncAdapter<FinalizerState>
  implements Finalizer,
  AccessibleFields
{
  accessedFields: OneTimeValueEmitter<Set<string>>;

  constructor(finalizerFn: SyncFinalizerFn, aggregator: MultiFieldAggregator) {
    super(finalizerFn, aggregator);
    this.accessedFields = aggregator.accessedFields;
  }
}
