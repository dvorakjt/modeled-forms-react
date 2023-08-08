import { DualField } from "../../types/constituents/fields/dual-field.interface";
import { BaseFieldFactory } from "../../types/constituents/fields/base-field-factory.interface";
import { Field } from "../../types/constituents/fields/field.interface";
import { AsyncValidator } from "../../types/constituents/validators/async-validator.type";
import { SingleInputValidatorSuiteFactory } from "../../types/constituents/validators/single-input/single-input-validator-suite-factory.interface";
import { SyncValidator } from "../../types/constituents/validators/sync-validator.type";
import { DualFieldImpl } from "./dual-field-impl";
import { FieldImpl } from "./field-impl";

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