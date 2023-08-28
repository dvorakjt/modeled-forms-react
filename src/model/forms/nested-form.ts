import { BehaviorSubject, type Subject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import { AbstractNestedForm } from './abstract-nested-form';
import type { State } from '../state/state.interface';
import type { FinalizerManager } from '../finalizers/finalizer-manager.interface';
import type { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import type { MultiInputValidatorMessagesAggregator } from '../aggregators/multi-input-validator-messages-aggregator.interface';
import { FirstNonValidFormElementTracker } from '../trackers/first-nonvalid-form-element-tracker.interface';

export class NestedForm extends AbstractNestedForm {
  readonly stateChanges: Subject<State<any>>;
  readonly userFacingFields: FormElementDictionary;
  readonly #firstNonValidFormElementTracker : FirstNonValidFormElementTracker;
  readonly #finalizerManager: FinalizerManager;
  readonly #multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator;
  readonly #omitByDefault;
  #omit;

  get state() {
    return copyObject({
      ...this.#finalizerManager.state,
      messages: [
        ...this.#multiFieldValidatorMessagesAggregator.messages,
        ...this.#finalizerManager.state.messages,
      ],
      omit: this.#omit,
    });
  }

  get firstNonValidFormElement() : string | undefined {
    return this.#firstNonValidFormElementTracker.firstNonValidFormElement;
  }

  get firstNonValidFormElementChanges() : Subject<string | undefined> {
    return this.#firstNonValidFormElementTracker.firstNonValidFormElementChanges;
  }

  set omit(omit: boolean) {
    this.#omit = omit;
    if (this.stateChanges) this.stateChanges.next(this.state);
  }

  get omit() {
    return this.#omit;
  }

  constructor(
    userFacingFields: FormElementDictionary,
    firstNonValidFormElementTracker : FirstNonValidFormElementTracker,
    finalizerManager: FinalizerManager,
    multiFieldValidatorMessagesAggregator: MultiInputValidatorMessagesAggregator,
    omitByDefault: boolean,
  ) {
    super();
    this.userFacingFields = userFacingFields;
    this.#firstNonValidFormElementTracker = firstNonValidFormElementTracker;
    this.#finalizerManager = finalizerManager;
    this.#multiFieldValidatorMessagesAggregator =
      multiFieldValidatorMessagesAggregator;
    this.#omitByDefault = omitByDefault;
    this.#omit = this.#omitByDefault;

    this.#multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(
      () => {
        this.stateChanges?.next(this.state);
      },
    );

    this.#finalizerManager.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges?.next(this.state);
    });

    this.stateChanges = new BehaviorSubject(this.state);
  }

  reset() {
    this.#omit = this.#omitByDefault;
    for (const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }
}
