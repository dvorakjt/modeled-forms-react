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
import { ConfirmationManager, TryConfirmArgsObject } from '../confirmation/confirmation-manager.interface';
import { AbstractNestedForm } from './abstract-nested-form';

export class RootForm extends AbstractRootForm {
  readonly stateChanges: Subject<State<any>>;
  readonly confirmationAttemptedChanges: Subject<boolean>;
  readonly submissionStateChanges: Subject<SubmissionState>;
  readonly userFacingFields: FormElementDictionary;
  readonly extractedValues: ExtractedValueDictionary;
  readonly _firstNonValidFormElementTracker: FirstNonValidFormElementTracker;
  readonly _finalizerManager: FinalizerManager;
  readonly _multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator;
  readonly _confirmationManager : ConfirmationManager;
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

  get confirmationAttempted() : boolean {
    return this._confirmationManager.confirmationState.confirmationAttempted;
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
    confirmationManager : ConfirmationManager,
    submissionManager: SubmissionManager,
  ) {
    super();
    this.userFacingFields = userFacingFields;
    this.extractedValues = extractedValues;
    this._firstNonValidFormElementTracker = firstNonValidFormElementTracker;
    this._finalizerManager = finalizerManager;
    this._multiFieldValidatorMessagesAggregator =
      multiFieldValidatorMessagesAggregator;
    this._confirmationManager = confirmationManager;
    this._submissionManager = submissionManager;

    this._multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(
      () => {
        this.stateChanges?.next(this.state);
      },
    );

    this._finalizerManager.stateChanges.subscribe(() => {
      //if there are changes to fields, clear confirmation and submission messages
      this._confirmationManager.clearMessage();
      this._submissionManager.clearMessage();
      this.stateChanges?.next(this.state);
    });

    this._submissionManager.submissionStateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
      if (this.submissionStateChanges)
        this.submissionStateChanges.next(this.submissionState);
    });

    this._confirmationManager.confirmationStateChanges.subscribe(() => {
      if(this.stateChanges) this.stateChanges.next(this.state);
      if(this.confirmationAttemptedChanges) this.confirmationAttemptedChanges.next(this.confirmationAttempted);
    });

    this.confirmationAttemptedChanges = new BehaviorSubject<boolean>(this.confirmationAttempted);

    this.submissionStateChanges = new BehaviorSubject(this.submissionState);

    this.stateChanges = new BehaviorSubject(this.state);
  }

  tryConfirm({onError, onSuccess, errorMessage}: TryConfirmArgsObject): void {
    //call try confirm on all nested fields
    for(const fieldName in this.userFacingFields) {
      const field = this.userFacingFields[fieldName];
      if(field instanceof AbstractNestedForm) {
        field.tryConfirm({});
      } 
    }
    this._confirmationManager.tryConfirm({
      validity : this.state.validity,
      onError,
      onSuccess,
      errorMessage
    });
  }

  submit() {
    return this._submissionManager.submit(this.state);
  }

  reset() {
    this._confirmationManager.reset();
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

    if(this._confirmationManager.confirmationState.message) {
      messages.push(this._confirmationManager.confirmationState.message);
    }

    if (this._submissionManager.submissionState.message)
      messages.push(this._submissionManager.submissionState.message);
    return messages;
  }
}
