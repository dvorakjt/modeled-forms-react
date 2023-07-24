import { ManagedSubject } from "../subscriptions/managed-subject";
import { copyObject } from "../util/copy-object";
import { BehaviorSubject } from "rxjs";
import { ManagedSubscription } from "../subscriptions/managed-subscription";
import type { Field } from "../types/fields/field.interface";
import type { FieldState } from "../types/state/field-state.interface";
import type { SubscriptionManager } from "../types/subscriptions/subscription-manager.interface";
import type { SingleInputValidatorSuite } from "../types/validators/single-input/single-input-validator-suite.interface";
import { ManagedObservable } from "../subscriptions/managed-observable";
import { ValidatorSuiteResult } from "../types/validators/validator-suite-result.interface";
import { MessageType } from "../types/state/messages/message-type.enum";
import { Message } from "../types/state/messages/message.interface";

export class SimpleField implements Field {
  stateChanges: ManagedSubject<FieldState>;
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
    const initialState = this.#validatorSuite.evaluate(this.#defaultValue);
    this.#state = {
      ...initialState.syncResult,
      omit : this.#omitByDefault
    }
    this.stateChanges = this.#subscriptionManager.registerSubject(new BehaviorSubject(this.state));
    if(initialState.observable) this.handleValidityObservable(initialState.observable);
  }

  setValue(value: string) {
    if(this.#validatorSuiteSubscription) this.#validatorSuiteSubscription.unsubscribe();
    const validityResult = this.#validatorSuite.evaluate(value);
    this.setState({
      ...validityResult.syncResult,
      omit: this.state.omit
    });
    if(validityResult.observable) this.handleValidityObservable(validityResult.observable);
  }

  setState(state : FieldState) {
    this.#state = copyObject(state);
    this.stateChanges.next(this.state);
  }

  reset() {
    this.#state.omit = this.#omitByDefault;
    this.setValue(this.#defaultValue);
  }

  private handleValidityObservable(observable : ManagedObservable<ValidatorSuiteResult<string>>) {
    this.#validatorSuiteSubscription = observable.subscribe(result => {
      this.setState({
        ...result,
        messages: [
          ...this.state.messages.filter((message : Message) => message.type !== MessageType.PENDING),
          ...result.messages
        ],
        omit : this.state.omit
      });
    });
  }
}