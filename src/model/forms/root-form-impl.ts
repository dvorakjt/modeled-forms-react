import { BehaviorSubject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { State } from '../types/state/state.interface';
import type { RootForm } from '../types/forms/root-form.interface';
import type { SubmissionManager } from '../types/submission/submission-manager.interface';
import type { Message } from '../types/state/messages/message.interface';
import type { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';
import { FinalizerManager } from '../types/finalizers/finalizer-manager.interface';
import { FormElementMap } from '../types/form-elements/form-element-map.type';
import { MultiFieldValidatorMessagesAggregator } from '../types/aggregators/multi-field-validator-messages-aggregator';
import { SubmissionState } from '../types/submission/submission-state.interface';

export class RootFormImpl implements RootForm {
  readonly stateChanges: ManagedSubject<State<any>>;
  readonly submissionStateChanges: ManagedSubject<SubmissionState>;
  readonly userFacingFields : FormElementMap;
  readonly #finalizerManager : FinalizerManager;
  readonly #multiFieldValidatorMessagesAggregator : MultiFieldValidatorMessagesAggregator;
  readonly #managedObservableFactory: ManagedObservableFactory;
  readonly #subscriptionManager: SubscriptionManager;
  readonly #submissionManager: SubmissionManager;

  get state() {
    const messages = this.aggregateMessages();
    return copyObject({
      ...this.#finalizerManager.state,
      messages,
    });
  }

  get submissionState() {
    return {
      submissionAttempted : this.#submissionManager.submissionState.submissionAttempted
    }
  }

  constructor(
    userFacingFields : FormElementMap,
    finalizerManager : FinalizerManager,
    multiFieldValidatorMessagesAggregator : MultiFieldValidatorMessagesAggregator,
    submissionManager: SubmissionManager,
    managedObservableFactory: ManagedObservableFactory,
    subscriptionManager: SubscriptionManager,
  ) {
    this.userFacingFields = userFacingFields;
    this.#finalizerManager = finalizerManager;
    this.#multiFieldValidatorMessagesAggregator = multiFieldValidatorMessagesAggregator;
    this.#submissionManager = submissionManager;
    this.#managedObservableFactory = managedObservableFactory;
    this.#subscriptionManager = subscriptionManager;

    this.#multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(() => {
      this.stateChanges?.next(this.state);
    });

    this.#finalizerManager.stateChanges.subscribe(() => {
      this.#submissionManager.clearMessage();
      this.stateChanges?.next(this.state);
    });

    this.#submissionManager.submissionStateChanges.subscribe(() => {
      if(this.stateChanges) this.stateChanges.next(this.state);
      if(this.submissionStateChanges) this.submissionStateChanges.next(this.submissionState);
    });

    this.submissionStateChanges = this.#managedObservableFactory.createManagedSubject(new BehaviorSubject(this.submissionState));

    this.stateChanges = this.#managedObservableFactory.createManagedSubject(
      new BehaviorSubject(this.state),
    );
  }

  async submit() {
    return this.#submissionManager.submit(this.state);
  }

  reset() {
    this.#submissionManager.reset();
    for(const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }

  unsubscribeAll() {
    return this.#subscriptionManager.unsubscribeAll();
  }

  private aggregateMessages(): Array<Message> {
    const messages = [
      ...this.#multiFieldValidatorMessagesAggregator.messages,
      ...this.#finalizerManager.state.messages
    ];
    if (this.#submissionManager.submissionState.message)
      messages.push(this.#submissionManager.submissionState.message);
    return messages;
  }
}
