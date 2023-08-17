import { DualField } from "./dual-field.interface";
import { BaseFieldFactory, BaseFieldFactoryKey, BaseFieldFactoryKeyType } from "./base-field-factory.interface";
import { Field } from "./field.interface";
import { AsyncValidator } from "../../validators/async-validator.type";
import { SingleInputValidatorFactoryKey, SingleInputValidatorSuiteFactory } from "../../validators/single-input/single-input-validator-suite-factory.interface";
import { SyncValidator } from "../../validators/sync-validator.type";
import { DualFieldImpl } from "./dual-field-impl";
import { FieldImpl } from "./field-impl";
import { autowire } from 'undecorated-di';

export class BaseFieldFactoryImpl implements BaseFieldFactory {
  #singleInputValidatorSuiteFactory : SingleInputValidatorSuiteFactory;
  
  constructor(singleInputValidatorSuiteFactory : SingleInputValidatorSuiteFactory) {
    this.#singleInputValidatorSuiteFactory = singleInputValidatorSuiteFactory;
  }

  createField(defaultValue: string, omitByDefault: boolean, syncValidators: SyncValidator<string>[], asyncValidators: AsyncValidator<string>[], pendingAsyncValidatorMessage? : string): Field {
    const validatorSuite = this.#singleInputValidatorSuiteFactory.createSingleInputValidatorSuite(syncValidators, asyncValidators, pendingAsyncValidatorMessage);
    return new FieldImpl(validatorSuite, defaultValue, omitByDefault);
  }

  createDualField(primaryDefaultValue: string, secondaryDefaultValue: string, omitByDefault: boolean, syncValidators: SyncValidator<string>[], asyncValidators: AsyncValidator<string>[], pendingAsyncValidatorMessage? : string): DualField {
    const primaryField = this.createField(primaryDefaultValue, false, syncValidators, asyncValidators, pendingAsyncValidatorMessage);
    const secondaryField = this.createField(secondaryDefaultValue, false, syncValidators, asyncValidators, pendingAsyncValidatorMessage);
    return new DualFieldImpl(primaryField, secondaryField, omitByDefault);
  }  
}

export default autowire<BaseFieldFactoryKeyType, BaseFieldFactory, BaseFieldFactoryImpl>(
  BaseFieldFactoryImpl,
  BaseFieldFactoryKey,
  [
    SingleInputValidatorFactoryKey
  ]
);