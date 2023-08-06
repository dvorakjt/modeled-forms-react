import { BehaviorSubject, type Subject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import type { State } from '../types/state/state.interface';
import type { RootForm } from '../types/forms/root-form.interface';
import type { SubmissionManager } from '../types/submission/submission-manager.interface';
import type { Message } from '../types/state/messages/message.interface';
import type { FinalizerManager } from '../types/finalizers/finalizer-manager.interface';
import type { FormElementMap } from '../types/form-elements/form-element-map.type';
import type { MultiInputValidatorMessagesAggregator } from '../types/aggregators/multi-input-validator-messages-aggregator.interface';
import type { SubmissionState } from '../types/submission/submission-state.interface';

export class RootFormImpl implements RootForm {
  readonly stateChanges: Subject<State<any>>;
  readonly submissionStateChanges: Subject<SubmissionState>;
  readonly userFacingFields : FormElementMap;
  readonly #finalizerManager : FinalizerManager;
  readonly #multiFieldValidatorMessagesAggregator : MultiInputValidatorMessagesAggregator;
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
    multiFieldValidatorMessagesAggregator : MultiInputValidatorMessagesAggregator,
    submissionManager: SubmissionManager
  ) {
    this.userFacingFields = userFacingFields;
    this.#finalizerManager = finalizerManager;
    this.#multiFieldValidatorMessagesAggregator = multiFieldValidatorMessagesAggregator;
    this.#submissionManager = submissionManager;

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

    this.submissionStateChanges = new BehaviorSubject(this.submissionState);

    this.stateChanges = new BehaviorSubject(this.state);
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
