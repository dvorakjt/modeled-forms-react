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

export class RootFormImpl implements RootForm {
  readonly stateChanges: ManagedSubject<State<any>>;
  readonly submissionChanges: ManagedSubject<boolean>;
  readonly userFacingFields : FormElementMap;
  readonly #finalizerManager : FinalizerManager;
  readonly #multiFieldValidatorMessagesAggregator : MultiFieldValidatorMessagesAggregator;
  readonly #managedObservableFactory: ManagedObservableFactory;
  readonly #subscriptionManager: SubscriptionManager;
  readonly #submissionManager: SubmissionManager;
  #hasSubmitted: boolean = false;

  get state() {
    const messages = this.aggregateMessages();
    return copyObject({
      ...this.#finalizerManager.state,
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
    if (this.#submissionManager.message)
      messages.push(this.#submissionManager.message);
    return messages;
  }
}
