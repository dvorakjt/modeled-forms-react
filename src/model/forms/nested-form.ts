import { BehaviorSubject, type Subject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import { AbstractNestedForm } from './abstract-nested-form';
import type { State } from '../state/state.interface';
import type { FinalizerManager } from '../finalizers/finalizer-manager.interface';
import type { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import type { MultiInputValidatorMessagesAggregator } from '../aggregators/multi-input-validator-messages-aggregator.interface';
import { FirstNonValidFormElementTracker } from '../trackers/first-nonvalid-form-element-tracker.interface';
import { ExtractedValueDictionary } from '../extracted-values/extracted-value-dictionary.type';

export class NestedForm extends AbstractNestedForm {
  readonly stateChanges: Subject<State<any>>;
  readonly userFacingFields: FormElementDictionary;
  readonly extractedValues: ExtractedValueDictionary;
  readonly _firstNonValidFormElementTracker: FirstNonValidFormElementTracker;
  readonly _finalizerManager: FinalizerManager;
  readonly _multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator;
  readonly _omitByDefault;
  _omit;

  get state() {
    return copyObject({
      ...this._finalizerManager.state,
      messages: [
        ...this._multiFieldValidatorMessagesAggregator.messages,
        ...this._finalizerManager.state.messages,
      ],
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

  constructor(
    userFacingFields: FormElementDictionary,
    extractedValues : ExtractedValueDictionary,
    firstNonValidFormElementTracker: FirstNonValidFormElementTracker,
    finalizerManager: FinalizerManager,
    multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator,
    omitByDefault: boolean,
  ) {
    super();
    this.userFacingFields = userFacingFields;
    this.extractedValues = extractedValues;
    this._firstNonValidFormElementTracker = firstNonValidFormElementTracker;
    this._finalizerManager = finalizerManager;
    this._multiFieldValidatorMessagesAggregator =
      multiFieldValidatorMessagesAggregator;
    this._omitByDefault = omitByDefault;
    this._omit = this._omitByDefault;

    this._multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(
      () => {
        this.stateChanges?.next(this.state);
      },
    );

    this._finalizerManager.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges?.next(this.state);
    });

    this.stateChanges = new BehaviorSubject(this.state);
  }

  reset() {
    this._omit = this._omitByDefault;
    for (const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }
}
