import { AbstractMultiInputValidatedField } from "./abstract-multi-input-validated-field";
import { Field } from "../types/fields/field.interface";
import { ManagedObservableFactory } from "../types/subscriptions/managed-observable-factory.interface";
import { FinalizerFacingMultiInputValidatorReducer } from "../reducers/finalizer-facing-multi-input-validator-reducer";

export class FinalizerFacingMultiInputValidatedField extends AbstractMultiInputValidatedField {
  constructor(baseField : Field, finalizerFacingMultiInputValidityReducer : FinalizerFacingMultiInputValidatorReducer, managedObservableFactory : ManagedObservableFactory) {
    super(baseField, finalizerFacingMultiInputValidityReducer, managedObservableFactory);
  }
}