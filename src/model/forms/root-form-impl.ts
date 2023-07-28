import { BehaviorSubject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { State } from '../types/state/state.interface';
import type { RootForm } from '../types/forms/root-form.interface';
import type { FormStateManager } from '../types/forms/form-state-manager.interface';
import type { SubmissionManager } from '../types/submission/submission-manager.interface';
import type { Message } from '../types/state/messages/message.interface';
import type { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';

export class RootFormImpl implements RootForm {
  readonly stateChanges: ManagedSubject<State<any>>;
  readonly submissionChanges: ManagedSubject<boolean>;
  readonly #formStateManager: FormStateManager;
  readonly #managedObservableFactory: ManagedObservableFactory;
  readonly #subscriptionManager: SubscriptionManager;
  readonly #submissionManager: SubmissionManager;
  #hasSubmitted: boolean = false;

  get state() {
    const messages = this.aggregateMessages();
    return copyObject({
      ...this.#formStateManager.state,
      messages,
    });
  }

  set hasSubmitted(hasSubmitted: boolean) {
    const changeDetected = hasSubmitted !== this.#hasSubmitted;
    this.#hasSubmitted = hasSubmitted;
    if (changeDetected) this.submissionChanges.next(this.hasSubmitted);
  }

  get hasSubmitted() {
    return this.#hasSubmitted;
  }

  constructor(
    formStateManager: FormStateManager,
    submissionManager: SubmissionManager,
    managedObservableFactory: ManagedObservableFactory,
    subscriptionManager: SubscriptionManager,
  ) {
    this.#formStateManager = formStateManager;
    this.#submissionManager = submissionManager;
    this.#managedObservableFactory = managedObservableFactory;
    this.#subscriptionManager = subscriptionManager;

    this.#formStateManager.stateChanges.subscribe(() => {
      this.#submissionManager.clearMessage();
      this.stateChanges?.next(this.state);
    });

    this.submissionChanges =
      this.#managedObservableFactory.createManagedSubject(
        new BehaviorSubject(this.hasSubmitted),
      );
    this.#submissionManager.submissionChanges.subscribe(() => {
      this.stateChanges?.next(this.state);
    });

    this.stateChanges = this.#managedObservableFactory.createManagedSubject(
      new BehaviorSubject(this.state),
    );
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

  private aggregateMessages(): Array<Message> {
    const messages = [...this.#formStateManager.state.messages];
    if (this.#submissionManager.message)
      messages.push(this.#submissionManager.message);
    return messages;
  }
}
