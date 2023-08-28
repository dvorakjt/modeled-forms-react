import { BehaviorSubject, type Subject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import type { State } from '../state/state.interface';
import { AbstractRootForm } from './abstract-root-form';
import type { SubmissionManager } from '../submission/submission-manager.interface';
import type { Message } from '../state/messages/message.interface';
import type { FinalizerManager } from '../finalizers/finalizer-manager.interface';
import type { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import type { MultiInputValidatorMessagesAggregator } from '../aggregators/multi-input-validator-messages-aggregator.interface';
import type { SubmissionState } from '../submission/submission-state.interface';
import { FirstNonValidFormElementTracker } from '../trackers/first-nonvalid-form-element-tracker.interface';

export class RootForm extends AbstractRootForm {
  readonly stateChanges: Subject<State<any>>;
  readonly submissionStateChanges: Subject<SubmissionState>;
  readonly userFacingFields: FormElementDictionary;
  readonly #firstNonValidFormElementTracker : FirstNonValidFormElementTracker;
  readonly #finalizerManager: FinalizerManager;
  readonly #multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator;
  readonly #submissionManager: SubmissionManager;

  get state() {
    const messages = this.aggregateMessages();
    return copyObject({
      ...this.#finalizerManager.state,
      messages,
    });
  }

  get firstNonValidFormElement() : string | undefined {
    return this.#firstNonValidFormElementTracker.firstNonValidFormElement;
  }

  get firstNonValidFormElementChanges() : Subject<string | undefined> {
    return this.#firstNonValidFormElementTracker.firstNonValidFormElementChanges;
  }

  get submissionState() {
    return {
      submissionAttempted:
        this.#submissionManager.submissionState.submissionAttempted,
    };
  }
  
  constructor(
    userFacingFields: FormElementDictionary,
    firstNonValidFormElementTracker : FirstNonValidFormElementTracker,
    finalizerManager: FinalizerManager,
    multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator,
    submissionManager: SubmissionManager,
  ) {
    super();
    this.userFacingFields = userFacingFields;
    this.#firstNonValidFormElementTracker = firstNonValidFormElementTracker;
    this.#finalizerManager = finalizerManager;
    this.#multiFieldValidatorMessagesAggregator =
      multiFieldValidatorMessagesAggregator;
    this.#submissionManager = submissionManager;

    this.#multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(
      () => {
        this.stateChanges?.next(this.state);
      },
    );

    this.#finalizerManager.stateChanges.subscribe(() => {
      this.#submissionManager.clearMessage();
      this.stateChanges?.next(this.state);
    });

    this.#submissionManager.submissionStateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
      if (this.submissionStateChanges)
        this.submissionStateChanges.next(this.submissionState);
    });

    this.submissionStateChanges = new BehaviorSubject(this.submissionState);

    this.stateChanges = new BehaviorSubject(this.state);
  }

  async submit() {
    return this.#submissionManager.submit(this.state);
  }

  reset() {
    this.#submissionManager.reset();
    for (const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }

  private aggregateMessages(): Array<Message> {
    const messages = [
      ...this.#multiFieldValidatorMessagesAggregator.messages,
      ...this.#finalizerManager.state.messages,
    ];
    if (this.#submissionManager.submissionState.message)
      messages.push(this.#submissionManager.submissionState.message);
    return messages;
  }
}
