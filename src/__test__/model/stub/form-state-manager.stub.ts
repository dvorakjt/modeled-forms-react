import { ManagedSubject } from "../../../model/subscriptions/managed-subject";
import type { FormStateManager } from "../../../model/types/forms/form-state-manager.interface";
import { State } from "../../../model/types/state/state.interface";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import { Validity } from "../../../model/types/state/validity.enum";
import { BehaviorSubject } from "rxjs";

export class FormStateManagerStub implements FormStateManager {
  static defaultState = {
    value: {},
    validity: Validity.PENDING,
    messages: []
  };
  stateChanges?: ManagedSubject<State<any>> | undefined;
  #state : State<any>;
  #subscriptionManager : SubscriptionManager;

  set state(state : State<any>) {
    console.log(Object.getOwnPropertySymbols(state));
    this.#state = state;
    if(this.stateChanges) this.stateChanges.next(this.state);
    else this.stateChanges = this.#subscriptionManager.registerSubject(new BehaviorSubject(this.state));
  }
  
  get state() {
    return this.#state;
  }
  
  constructor(subscriptionManager : SubscriptionManager) {
    this.#subscriptionManager = subscriptionManager;
    this.state = FormStateManagerStub.defaultState;
  }

  reset() {
    this.state = FormStateManagerStub.defaultState;
  }
}