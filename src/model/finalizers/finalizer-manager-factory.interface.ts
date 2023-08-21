import { FinalizerManager } from "./finalizer-manager.interface";
import { FinalizerDictionary } from "./finalizer-map.type";

interface FinalizerManagerFactory {
  createFinalizerManager(finalizerDictionary : FinalizerDictionary) : FinalizerManager;
}
const FinalizerManagerFactoryKey = 'FinalizerManager';
type FinalizerManagerFactoryKeyType = typeof FinalizerManagerFactoryKey;

export { FinalizerManagerFactoryKey, type FinalizerManagerFactory, type FinalizerManagerFactoryKeyType };