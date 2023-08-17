import { AsyncValidator } from "../../validators/async-validator.type";
import { SyncValidator } from "../../validators/sync-validator.type";
import { AbstractField } from "./abstract-field";
import { AbstractDualField } from "./abstract-dual-field";

export interface BaseFieldFactory {
  createField(
    defaultValue : string, 
    omitByDefault : boolean,
    syncValidators: Array<SyncValidator<string>>, 
    asyncValidators: Array<AsyncValidator<string>>, 
    pendingAsyncValidatorMessage? : string
  ) : AbstractField;
  createDualField(
    primaryDefaultValue : string,
    secondaryDefaultValue : string,
    omitByDefault : boolean,
    syncValidators: Array<SyncValidator<string>>, 
    asyncValidators: Array<AsyncValidator<string>>, 
    pendingAsyncValidatorMessage? : string
  ) : AbstractDualField;
}

export const BaseFieldFactoryKey = 'BaseFieldFactory';

export type BaseFieldFactoryKeyType = typeof BaseFieldFactoryKey;