import { AsyncBaseFinalizerFn } from './async-base-finalizer-fn.type';
import { AsyncFinalizerFn } from './async-finalizer-fn.type';
import { SyncBaseFinalizerFn } from './sync-base-finalizer-fn.type';
import { SyncFinalizerFn } from './sync-finalizer-fn.type';

interface FinalizerFnFactory {
  createSyncFinalizerFn(baseAdapterFn: SyncBaseFinalizerFn): SyncFinalizerFn;
  createAsyncFinalizerFn(baseAdapterFn: AsyncBaseFinalizerFn): AsyncFinalizerFn;
}
const FinalizerFnFactoryKey = 'FinalizerFnFactory';
type FinalizerFnFactoryKeyType = typeof FinalizerFnFactoryKey;

export {
  FinalizerFnFactoryKey,
  type FinalizerFnFactory,
  type FinalizerFnFactoryKeyType,
};
