import { BehaviorSubject, type Subject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import { AbstractNestedForm } from './abstract-nested-form';
import type { State } from '../state/state.interface';
import type { FinalizerManager } from '../finalizers/finalizer-manager.interface';
import type { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import type { MultiInputValidatorMessagesAggregator } from '../aggregators/multi-input-validator-messages-aggregator.interface';
import { FirstNonValidFormElementTracker } from '../trackers/first-nonvalid-form-element-tracker.interface';
import { ExtractedValueDictionary } from '../extracted-values/extracted-value-dictionary.type';
import {
  ConfirmationManager,
  TryConfirmArgsObject,
} from '../confirmation/confirmation-manager.interface';
import { Message } from '../state/messages/message.interface';

export class NestedForm extends AbstractNestedForm {
  readonly stateChanges: Subject<State<any>>;
  readonly confirmationAttemptedChanges: Subject<boolean>;
  readonly userFacingFields: FormElementDictionary;
  readonly extractedValues: ExtractedValueDictionary;
  readonly _firstNonValidFormElementTracker: FirstNonValidFormElementTracker;
  readonly _finalizerManager: FinalizerManager;
  readonly _confirmationManager: ConfirmationManager;
  readonly _multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator;
  readonly _omitByDefault;
  _omit;

  get state() {
    return copyObject({
      ...this._finalizerManager.state,
      messages: this._aggregateMessages(),
      omit: this._omit,
    });
  }

  get firstNonValidFormElement(): string | undefined {
    return this._firstNonValidFormElementTracker.firstNonValidFormElement;
  }

  get firstNonValidFormElementChanges(): Subject<string | undefined> {
    return this._firstNonValidFormElementTracker
      .firstNonValidFormElementChanges;
  }

  set omit(omit: boolean) {
    this._omit = omit;
    if (this.stateChanges) this.stateChanges.next(this.state);
  }

  get omit() {
    return this._omit;
  }

  get confirmationAttempted(): boolean {
    return this._confirmationManager.confirmationState.confirmationAttempted;
  }

  constructor(
    userFacingFields: FormElementDictionary,
    extractedValues: ExtractedValueDictionary,
    firstNonValidFormElementTracker: FirstNonValidFormElementTracker,
    finalizerManager: FinalizerManager,
    multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator,
    confirmationManager: ConfirmationManager,
    omitByDefault: boolean,
  ) {
    super();
    this.userFacingFields = userFacingFields;
    this.extractedValues = extractedValues;
    this._firstNonValidFormElementTracker = firstNonValidFormElementTracker;
    this._finalizerManager = finalizerManager;
    this._multiFieldValidatorMessagesAggregator =
      multiFieldValidatorMessagesAggregator;
    this._confirmationManager = confirmationManager;
    this._omitByDefault = omitByDefault;
    this._omit = this._omitByDefault;

    this._multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(
      () => {
        this.stateChanges?.next(this.state);
      },
    );

    this._finalizerManager.stateChanges.subscribe(() => {
      this._confirmationManager.clearMessage();
      if (this.stateChanges) this.stateChanges?.next(this.state);
    });

    this._confirmationManager.confirmationStateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges.next(this.state);
      if (this.confirmationAttemptedChanges)
        this.confirmationAttemptedChanges.next(this.confirmationAttempted);
    });

    this.confirmationAttemptedChanges = new BehaviorSubject<boolean>(
      this.confirmationAttempted,
    );

    this.stateChanges = new BehaviorSubject(this.state);
  }

  tryConfirm({ onError, onSuccess, errorMessage }: TryConfirmArgsObject): void {
    //call try confirm on all nested forms
    for (const fieldName in this.userFacingFields) {
      const field = this.userFacingFields[fieldName];
      if (field instanceof AbstractNestedForm) {
        field.tryConfirm({});
      }
    }
    this._confirmationManager.tryConfirm({
      validity: this.state.validity,
      onError,
      onSuccess,
      errorMessage,
    });
  }

  reset() {
    this._confirmationManager.reset();
    this._omit = this._omitByDefault;
    for (const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }

  _aggregateMessages(): Array<Message> {
    const messages = [
      ...this._multiFieldValidatorMessagesAggregator.messages,
      ...this._finalizerManager.state.messages,
    ];

    if (this._confirmationManager.confirmationState.message) {
      messages.push(this._confirmationManager.confirmationState.message);
    }

    return messages;
  }
}
