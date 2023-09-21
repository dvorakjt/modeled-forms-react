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
import { ExtractedValueDictionary } from '../extracted-values/extracted-value-dictionary.type';

export class RootForm extends AbstractRootForm {
  readonly stateChanges: Subject<State<any>>;
  readonly submissionStateChanges: Subject<SubmissionState>;
  readonly userFacingFields: FormElementDictionary;
  readonly extractedValues: ExtractedValueDictionary;
  readonly _firstNonValidFormElementTracker: FirstNonValidFormElementTracker;
  readonly _finalizerManager: FinalizerManager;
  readonly _multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator;
  readonly _submissionManager: SubmissionManager;

  get state() {
    const messages = this._aggregateMessages();
    return copyObject({
      ...this._finalizerManager.state,
      messages,
    });
  }

  get firstNonValidFormElement(): string | undefined {
    return this._firstNonValidFormElementTracker.firstNonValidFormElement;
  }

  get firstNonValidFormElementChanges(): Subject<string | undefined> {
    return this._firstNonValidFormElementTracker
      .firstNonValidFormElementChanges;
  }

  get submissionState() {
    return {
      submissionAttempted:
        this._submissionManager.submissionState.submissionAttempted,
    };
  }

  constructor(
    userFacingFields: FormElementDictionary,
    extractedValues : ExtractedValueDictionary,
    firstNonValidFormElementTracker: FirstNonValidFormElementTracker,
    finalizerManager: FinalizerManager,
    multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator,
    submissionManager: SubmissionManager,
  ) {
    super();
    this.userFacingFields = userFacingFields;
    this.extractedValues = extractedValues;
    this._firstNonValidFormElementTracker = firstNonValidFormElementTracker;
    this._finalizerManager = finalizerManager;
    this._multiFieldValidatorMessagesAggregator =
      multiFieldValidatorMessagesAggregator;
    this._submissionManager = submissionManager;

    this._multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(
      () => {
        this.stateChanges?.next(this.state);
      },
    );

    this._finalizerManager.stateChanges.subscribe(() => {
      this._submissionManager.clearMessage();
      this.stateChanges?.next(this.state);
    });

    this._submissionManager.submissionStateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
      if (this.submissionStateChanges)
        this.submissionStateChanges.next(this.submissionState);
    });

    this.submissionStateChanges = new BehaviorSubject(this.submissionState);

    this.stateChanges = new BehaviorSubject(this.state);
  }

  submit() {
    return this._submissionManager.submit(this.state);
  }

  reset() {
    this._submissionManager.reset();
    for (const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }

  _aggregateMessages(): Array<Message> {
    const messages = [
      ...this._multiFieldValidatorMessagesAggregator.messages,
      ...this._finalizerManager.state.messages,
    ];
    if (this._submissionManager.submissionState.message)
      messages.push(this._submissionManager.submissionState.message);
    return messages;
  }
}
