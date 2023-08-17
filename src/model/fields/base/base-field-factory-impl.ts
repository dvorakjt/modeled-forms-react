import { BaseFieldFactory, BaseFieldFactoryKey, BaseFieldFactoryKeyType } from "./base-field-factory.interface";
import { AsyncValidator } from "../../validators/async-validator.type";
import { SingleInputValidatorFactoryKey, SingleInputValidatorSuiteFactory } from "../../validators/single-input/single-input-validator-suite-factory.interface";
import { SyncValidator } from "../../validators/sync-validator.type";
import { AbstractField } from "./abstract-field";
import { AbstractDualField } from "./abstract-dual-field";
import { DualField } from "./dual-field";
import { Field } from "./field";
import { autowire } from 'undecorated-di';

export class BaseFieldFactoryImpl implements BaseFieldFactory {
  #singleInputValidatorSuiteFactory : SingleInputValidatorSuiteFactory;
  
  constructor(singleInputValidatorSuiteFactory : SingleInputValidatorSuiteFactory) {
    this.#singleInputValidatorSuiteFactory = singleInputValidatorSuiteFactory;
  }

  createField(defaultValue: string, omitByDefault: boolean, syncValidators: SyncValidator<string>[], asyncValidators: AsyncValidator<string>[], pendingAsyncValidatorMessage? : string): AbstractField {
    const validatorSuite = this.#singleInputValidatorSuiteFactory.createSingleInputValidatorSuite(syncValidators, asyncValidators, pendingAsyncValidatorMessage);
    return new Field(validatorSuite, defaultValue, omitByDefault);
  }

  createDualField(primaryDefaultValue: string, secondaryDefaultValue: string, omitByDefault: boolean, syncValidators: SyncValidator<string>[], asyncValidators: AsyncValidator<string>[], pendingAsyncValidatorMessage? : string): AbstractDualField {
    const primaryField = this.createField(primaryDefaultValue, false, syncValidators, asyncValidators, pendingAsyncValidatorMessage);
    const secondaryField = this.createField(secondaryDefaultValue, false, syncValidators, asyncValidators, pendingAsyncValidatorMessage);
    return new DualField(primaryField, secondaryField, omitByDefault);
  }  
}

export default autowire<BaseFieldFactoryKeyType, BaseFieldFactory, BaseFieldFactoryImpl>(
  BaseFieldFactoryImpl,
  BaseFieldFactoryKey,
  [
    SingleInputValidatorFactoryKey
  ]
);