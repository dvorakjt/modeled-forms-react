import { AsyncAdapterFn } from "../../adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../../adapters/sync-adapter-fn.type";

export interface ExtractedValuesTemplate {
  syncExtractedValues? : Record<string, SyncAdapterFn<any>>;
  asyncExtractedValues? : Record<string, AsyncAdapterFn<any>>;
}