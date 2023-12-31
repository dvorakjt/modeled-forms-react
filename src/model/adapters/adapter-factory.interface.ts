import { AsyncAdapter } from './async-adapter';
import { SyncAdapter } from './sync-adapter';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import { AsyncAdapterFn } from './async-adapter-fn.type';
import { SyncAdapterFn } from './sync-adapter-fn.type';

interface AdapterFactory {
  createSyncAdapterFromFnWithFields<V>(
    syncAdapterFn: SyncAdapterFn<V>,
    fields: FormElementDictionary,
  ): SyncAdapter<V>;
  createAsyncAdapterFromFnWithFields<V>(
    asyncAdapterFn: AsyncAdapterFn<V>,
    fields: FormElementDictionary,
  ): AsyncAdapter<V>;
}
const AdapterFactoryKey = 'AdapterFactory';
type AdapterFactoryKeyType = typeof AdapterFactoryKey;

export { AdapterFactoryKey, type AdapterFactory, type AdapterFactoryKeyType };
