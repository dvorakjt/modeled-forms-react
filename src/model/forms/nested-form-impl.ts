
import { BehaviorSubject } from "rxjs";
import { ManagedSubject } from "../subscriptions/managed-subject";
import type { NestedForm } from "../types/forms/nested-form.interface";
import type { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';
import type { State } from "../types/state/state.interface";
import type { FormStateManager } from "../types/forms/form-state-manager.interface";
import { copyObject } from "../util/copy-object";

export class NestedFormImpl implements NestedForm {
  stateChanges?: ManagedSubject<State<any>>;
  #formStateManager: FormStateManager;
  #subscriptionManager : SubscriptionManager;
  #omit;
  #omitByDefault;

  get state() {
    return copyObject({
      ...this.#formStateManager.state,
      omit : this.#omit
    });
  }

  set omit(omit : boolean) {
    this.#omit = omit;
    if(this.stateChanges) this.stateChanges.next(this.state);
  }

  get omit() {
    return this.#omit;
  }

  constructor(formStateManager : FormStateManager, subscriptionManager : SubscriptionManager, omitByDefault : boolean) {
    this.#formStateManager = formStateManager;
    this.#subscriptionManager = subscriptionManager;
    this.#omitByDefault = omitByDefault;
    this.#omit = this.#omitByDefault;

    this.#formStateManager.stateChanges?.subscribe(() => {
      if(this.stateChanges) this.stateChanges.next(this.state);
      else this.stateChanges = this.#subscriptionManager.registerSubject(new BehaviorSubject(this.state));
    });
  }

  reset() {
    this.#omit = this.#omitByDefault;
    this.#formStateManager.reset();
  }
}