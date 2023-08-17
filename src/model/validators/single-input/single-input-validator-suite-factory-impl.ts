import { AsyncValidator } from "../async-validator.type";
import { SingleInputValidatorFactoryKey, SingleInputValidatorFactoryKeyType, SingleInputValidatorSuiteFactory } from "./single-input-validator-suite-factory.interface";
import { SingleInputValidatorSuite } from "./single-input-validator-suite.interface";
import { SyncValidator } from "../sync-validator.type";
import { GlobalMessages } from "../../constants/global-messages.enum";
import { AsyncSingleInputValidatorSuite } from "./async-single-input-validator-suite";
import { HybridSingleInputValidatorSuite } from "./hybrid-single-input-validator-suite";
import { SyncSingleInputValidatorSuite } from "./sync-single-input-validator-suite";
import { autowire } from "undecorated-di";

export class SingleInputValidatorSuiteFactoryImpl implements SingleInputValidatorSuiteFactory {
  createSingleInputValidatorSuite<T>(syncValidators: SyncValidator<T>[], asyncValidators: AsyncValidator<T>[], pendingAsyncValidatorMessage : string = GlobalMessages.PENDING_ASYNC_VALIDATOR_SUITE_MESSAGE): SingleInputValidatorSuite<T> {
    const syncValidatorSuite = new SyncSingleInputValidatorSuite(syncValidators);
    if(asyncValidators.length > 0) {
      const asyncValidatorSuite = new AsyncSingleInputValidatorSuite(asyncValidators, pendingAsyncValidatorMessage);
      if(syncValidators.length > 0) return new HybridSingleInputValidatorSuite(syncValidatorSuite, asyncValidatorSuite);
      else return asyncValidatorSuite;
    } else return syncValidatorSuite;
  }
}

export default autowire<SingleInputValidatorFactoryKeyType, SingleInputValidatorSuiteFactory, SingleInputValidatorSuiteFactoryImpl>(
  SingleInputValidatorSuiteFactoryImpl,
  SingleInputValidatorFactoryKey
);