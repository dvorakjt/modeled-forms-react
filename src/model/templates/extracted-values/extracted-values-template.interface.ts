import { AsyncExtractedValuesTemplate } from "./async-extracted-values-template.interface";
import { SyncExtractedValuesTemplate } from "./sync-extracted-values-template.interface";

export interface ExtractedValuesTemplate {
  syncExtractedValues? : SyncExtractedValuesTemplate,
  asyncExtractedValues? : AsyncExtractedValuesTemplate
}