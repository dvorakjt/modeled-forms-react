import { AsyncAdapter } from '../adapters/async-adapter';
import type { MultiFieldAggregator } from '../aggregators/multi-field-aggregator.interface';
import type { AsyncFinalizerFn } from './finalizer-functions/async-finalizer-fn.type';
import type { Finalizer } from './finalizer.interface';
import type { FinalizerState } from '../state/finalizer-state.interface';

export class AsyncFinalizer
  extends AsyncAdapter<FinalizerState>
  implements Finalizer
{
  constructor(finalizerFn: AsyncFinalizerFn, aggregator: MultiFieldAggregator) {
    super(finalizerFn, aggregator);
  }
}
