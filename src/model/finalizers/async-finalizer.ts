import { AsyncAdapter } from '../adapters/async-adapter';
import type { MultiFieldAggregator } from '../aggregators/multi-field-aggregator.interface';
import type { AsyncFinalizerFn } from './finalizer-functions/async-finalizer-fn.type';
import type { Finalizer } from './finalizer.interface';
import type { FinalizerState } from '../state/finalizer-state.interface';
import { AccessibleFields } from './accessible-fields.interface';
import { OneTimeValueEmitter } from '../emitters/one-time-value-emitter.interface';

export class AsyncFinalizer
  extends AsyncAdapter<FinalizerState>
  implements Finalizer, AccessibleFields
{
  accessedFields: OneTimeValueEmitter<Set<string>>;

  constructor(finalizerFn: AsyncFinalizerFn, aggregator: MultiFieldAggregator) {
    super(finalizerFn, aggregator);
    this.accessedFields = aggregator.accessedFields;
  }
}
