import { AsyncValidator } from "../../constituents/validators/async-validator.type";
import { SyncValidator } from "../../constituents/validators/sync-validator.type";

export type BaseFieldTemplate = {
  omitByDefault? : boolean;
  syncValidators?: Array<SyncValidator<string>>,
  asyncValidators?: Array<AsyncValidator<string>>
}