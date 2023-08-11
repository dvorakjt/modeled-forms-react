import { AsyncValidator } from "../async-validator.type";
import { SyncValidator } from "../sync-validator.type";
import { SingleInputValidatorSuite } from "./single-input-validator-suite.interface";

export interface SingleInputValidatorSuiteFactory {
  createSingleInputValidatorSuite<T>(syncValidators: SyncValidator<T>[], asyncValidators: AsyncValidator<T>[], pendingAsyncValidatorMessage? : string) : SingleInputValidatorSuite<T>;
}