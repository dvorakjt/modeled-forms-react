import { AsyncValidator } from "../../constituents/validators/async-validator.type";
import { SyncValidator } from "../../constituents/validators/sync-validator.type";

export interface ParsedBaseFieldTemplate {
  syncValidators : Array<SyncValidator<string>>;
  asyncValidators : Array<AsyncValidator<string>>;
  omitByDefault : boolean;
  pendingAsyncValidatorMessage? : string;
}