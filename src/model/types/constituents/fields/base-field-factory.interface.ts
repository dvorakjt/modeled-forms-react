import { AsyncValidator } from "../validators/async-validator.type";
import { SyncValidator } from "../validators/sync-validator.type";
import { DualField } from "./dual-field.interface";
import { Field } from "./field.interface";

export interface BaseFieldFactory {
  createField(
    defaultValue : string, 
    omitByDefault : boolean,
    syncValidators: Array<SyncValidator<string>>, 
    asyncValidators: Array<AsyncValidator<string>>, 
    pendingAsyncValidatorMessage? : string
  ) : Field;
  createDualField(
    primaryDefaultValue : string,
    secondaryDefaultValue : string,
    omitByDefault : boolean,
    syncValidators: Array<SyncValidator<string>>, 
    asyncValidators: Array<AsyncValidator<string>>, 
    pendingAsyncValidatorMessage? : string
  ) : DualField;
}