import { AsyncAdapterFn } from '../../adapters/async-adapter-fn.type';
import { FinalizerState } from '../../state/finalizer-state.interface';

export interface AsyncFinalizerFn extends AsyncAdapterFn<FinalizerState> {}
