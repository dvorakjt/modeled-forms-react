import { FormElementDictionary } from "../form-elements/form-element-dictionary.type";
import { StatefulFormElement } from "../form-elements/stateful-form-element.interface";
import { AsyncFinalizer } from "./async-finalizer";
import { DefaultFinalizer } from "./default-finalizer";
import { AsyncFinalizerFn } from "./finalizer-functions/async-finalizer-fn.type";
import { SyncFinalizerFn } from "./finalizer-functions/sync-finalizer-fn.type";
import { SyncFinalizer } from "./sync-finalizer";

interface FinalizerFactory {
  createSyncFinalizer(finalizerFn: SyncFinalizerFn, fields : FormElementDictionary) : SyncFinalizer;
  createAsyncFinalizer(finalizerFn : AsyncFinalizerFn, fields : FormElementDictionary) : AsyncFinalizer;
  createDefaultFinalizer(baseField : StatefulFormElement<any>) : DefaultFinalizer;
}
const FinalizerFactoryKey = 'FinalizerFactory';
type FinalizerFactoryKeyType = typeof FinalizerFactoryKey;

export { FinalizerFactoryKey, type FinalizerFactory, type FinalizerFactoryKeyType };