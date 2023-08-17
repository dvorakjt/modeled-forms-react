import { AsyncValidator } from "../../../validators/async-validator.type";
import { SyncValidator } from "../../../validators/sync-validator.type";

export type BaseFieldTemplate = {
  omitByDefault?: boolean;
  syncValidators?: Array<SyncValidator<string>>;
  asyncValidators?: Array<AsyncValidator<string>>;
  pendingAsyncValidatorMessage?: string;
};
