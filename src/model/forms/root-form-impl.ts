import { BehaviorSubject } from "rxjs";
import { ManagedSubject } from "../subscriptions/managed-subject";
import { copyObject } from "../util/copy-object";
import type { SubscriptionManager } from "../types/subscriptions/subscription-manager.interface";
import type { State } from "../types/state/state.interface";
import type { RootForm } from "../types/forms/root-form.interface";
import type { FormStateManager } from "../types/forms/form-state-manager.interface";
import type { SubmissionManager } from "../types/forms/submission-manager.interface";
import type { Message } from "../types/state/messages/message.interface";

export class RootFormImpl implements RootForm {
  stateChanges?: ManagedSubject<State<any>>;
  submissionChanges: ManagedSubject<boolean>;
  #formStateManager: FormStateManager;
  #subscriptionManager : SubscriptionManager;
  #hasSubmitted : boolean = false;
  #submissionManager : SubmissionManager;

  get state() {
    const messages = this.aggregateMessages();
    return copyObject({
      ...this.#formStateManager.state,
      messages
    });
  }

  set hasSubmitted(hasSubmitted : boolean) {
    const changeDetected = hasSubmitted !== this.#hasSubmitted;
    this.#hasSubmitted = hasSubmitted;
    if(changeDetected) this.submissionChanges.next(this.hasSubmitted);
  }

  get hasSubmitted() {
    return this.#hasSubmitted;
  }

  constructor(
    formStateManager : FormStateManager, 
    submissionManager : SubmissionManager, 
    subscriptionManager : SubscriptionManager
  ) {
    this.#formStateManager = formStateManager;
    this.#submissionManager = submissionManager;
    this.#subscriptionManager = subscriptionManager;

    this.#formStateManager.stateChanges?.subscribe(() => {
      this.#submissionManager.clearMessage();
      if(this.stateChanges) this.stateChanges.next(this.state);
      else this.stateChanges = this.#subscriptionManager.registerSubject(new BehaviorSubject(this.state));
    });

    this.submissionChanges = this.#subscriptionManager.registerSubject(new BehaviorSubject(this.hasSubmitted));
    submissionManager.submissionChanges.subscribe(() => {
      this.stateChanges?.next(this.state);
    });
  }

  async submit() {
    this.hasSubmitted = true;
    return this.#submissionManager.submit(this.state);
  }

  reset() {
    this.hasSubmitted = false;
    this.#submissionManager.clearMessage();
    this.#formStateManager.reset();
  }

  unsubscribeAll() {
    return this.#subscriptionManager.unsubscribeAll();
  }

  private aggregateMessages() : Array<Message> {
    const messages = [...this.#formStateManager.state.messages];
    if(this.#submissionManager.message) messages.push(this.#submissionManager.message);
    return messages;
  }
}