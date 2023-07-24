import { ManagedSubject } from "../subscriptions/managed-subject";
import { copyObject } from "../util/copy-object";
import { BehaviorSubject } from "rxjs";
import { ManagedSubscription } from "../subscriptions/managed-subscription";
import { Validity } from "../types/state/validity.enum";
import type { Field } from "../types/fields/field.interface";
import type { FieldState } from "../types/state/field-state.interface";
import type { SubscriptionManager } from "../types/subscriptions/subscription-manager.interface";
import type { SingleInputValidatorSuite } from "../types/validators/single-input/single-input-validator-suite.interface";

export class SimpleField implements Field {
  stateChanges?: ManagedSubject<FieldState>;
  #state : FieldState;
  #validatorSuite : SingleInputValidatorSuite<string>;
  #validatorSuiteSubscription? : ManagedSubscription;
  #subscriptionManager : SubscriptionManager;
  #defaultValue: string;
  #omitByDefault;

  get state() {
    return copyObject(this.#state);
  }

  set omit(omit : boolean) {
    this.setState({
      ...this.state,
      omit
    });
  } 

  get omit() {
    return this.state.omit as boolean;
  }

  constructor(
    validatorSuite : SingleInputValidatorSuite<string>, 
    defaultValue: string, 
    subscriptionManager : SubscriptionManager, 
    omitByDefault: boolean
  ) {
    this.#validatorSuite = validatorSuite;
    this.#defaultValue = defaultValue;
    this.#omitByDefault = omitByDefault;
    this.#subscriptionManager = subscriptionManager;
    //set default state
    this.#state = {
      value: this.#defaultValue,
      validity: Validity.PENDING,
      messages: [],
      omit: this.#omitByDefault
    };
    this.setValue(this.#defaultValue);
  }

  setValue(value: string) {
    if(this.#validatorSuiteSubscription) this.#validatorSuiteSubscription.unsubscribe();
    this.#validatorSuiteSubscription = this.#validatorSuite.evaluate(value).subscribe(result => {
      this.setState({
        ...result,
        omit : this.state.omit
      });
    });
  }

  setState(state : FieldState) {
    this.#state = copyObject(state);
    if(this.stateChanges) this.stateChanges.next(this.state);
    else this.stateChanges = this.#subscriptionManager.registerSubject(new BehaviorSubject(this.state));
  }

  reset() {
    this.#state.omit = this.#omitByDefault;
    this.setValue(this.#defaultValue);
  }
}