import { BehaviorSubject } from "rxjs";
import { ManagedSubject } from "../subscriptions/managed-subject";
import { DualField } from "../types/fields/dual-field.interface";
import { DualFieldState } from "../types/state/dual-field-state.interface";
import { SubscriptionManager } from "../types/subscriptions/subscription-manager.interface";
import { DualFieldSetValueArg } from "../types/state/dual-field-set-value-arg.interface";
import { DualFieldSetStateArg } from "../types/state/dual-field-set-state-arg.interface";
import { Field } from "../types/fields/field.interface";

export class DualFieldImpl implements DualField {
  primaryField : Field;
  secondaryField : Field;
  stateChanges : ManagedSubject<DualFieldState>;
  #useSecondaryField : boolean = false;
  #omit : boolean;
  #omitByDefault : boolean;
  
  get state() {
    const state = (!this.#useSecondaryField ? this.primaryField.state : this.secondaryField.state) as DualFieldState;
    state.useSecondaryField = this.#useSecondaryField
    state.omit = this.#omit;
    return state;
  }

  set useSecondaryField(useSecondaryField) {
    const changeDetected = this.useSecondaryField !== useSecondaryField;
    this.#useSecondaryField = useSecondaryField;
    if(this.stateChanges && changeDetected) this.stateChanges.next(this.state);
  }

  get useSecondaryField() {
    return this.#useSecondaryField;
  }

  set omit(omit : boolean) {
    this.#omit = omit;
    this.stateChanges?.next(this.state);
  }

  get omit() {
    return this.#omit;
  }

  constructor(
    primaryField : Field, 
    secondaryField : Field, 
    subscriptionManager : SubscriptionManager,
    omitByDefault : boolean
  ) {
    this.primaryField = primaryField;
    this.secondaryField = secondaryField;
    this.#omitByDefault = omitByDefault;
    this.#omit = this.#omitByDefault;
    this.primaryField.stateChanges.subscribe(() => {
      if(!(this.#useSecondaryField)) this.stateChanges?.next(this.state);
    });
    this.secondaryField.stateChanges.subscribe(() => {
      if(this.#useSecondaryField) this.stateChanges?.next(this.state);
    });
    this.stateChanges = subscriptionManager.registerSubject(new BehaviorSubject(this.state));
  }

  setValue(valueObj : DualFieldSetValueArg) {
    if(valueObj.primaryFieldValue) this.primaryField.setValue(valueObj.primaryFieldValue);
    if(valueObj.secondaryFieldValue) this.secondaryField.setValue(valueObj.secondaryFieldValue);
    if(valueObj.useSecondaryField !== undefined) this.useSecondaryField = valueObj.useSecondaryField;
  }

  setState(stateObj : DualFieldSetStateArg) {
    if(stateObj.omit !== undefined) this.omit = stateObj.omit;
    if(stateObj.primaryFieldState) this.primaryField.setState(stateObj.primaryFieldState);
    if(stateObj.secondaryFieldState) this.secondaryField.setState(stateObj.secondaryFieldState);
    if(stateObj.useSecondaryField !== undefined) this.useSecondaryField = stateObj.useSecondaryField;
  }

  reset() {
    this.#omit = this.#omitByDefault;
    this.primaryField.reset();
    this.secondaryField.reset();
    this.useSecondaryField = false;
  }
}