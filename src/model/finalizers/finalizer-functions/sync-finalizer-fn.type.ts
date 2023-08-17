import { SyncAdapterFn } from '../../adapters/sync-adapter-fn.type';
import { FinalizerState } from '../../state/finalizer-state.interface';

export interface SyncFinalizerFn extends SyncAdapterFn<FinalizerState> {}
