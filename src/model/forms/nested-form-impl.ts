import { BehaviorSubject, type Subject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import type { NestedForm } from './nested-form.interface';
import type { State } from '../state/state.interface';
import type { FinalizerManager } from '../finalizers/finalizer-manager.interface';
import type { FormElementMap } from '../form-elements/form-element-map.type';
import type { MultiInputValidatorMessagesAggregator } from '../aggregators/multi-input-validator-messages-aggregator.interface';

export class NestedFormImpl implements NestedForm {
  readonly stateChanges: Subject<State<any>>;
  readonly userFacingFields : FormElementMap;
  readonly #finalizerManager : FinalizerManager;
  readonly #multiFieldValidatorMessagesAggregator : MultiInputValidatorMessagesAggregator;
  readonly #omitByDefault;
  #omit;

  get state() {
    return copyObject({
      ...this.#finalizerManager.state,
      messages: [
        ...this.#multiFieldValidatorMessagesAggregator.messages,
        ...this.#finalizerManager.state.messages
      ],
      omit: this.#omit,
    });
  }

  set omit(omit: boolean) {
    this.#omit = omit;
    if (this.stateChanges) this.stateChanges.next(this.state);
  }

  get omit() {
    return this.#omit;
  }

  constructor(
    userFacingFields : FormElementMap,
    finalizerManager : FinalizerManager,
    multiFieldValidatorMessagesAggregator : MultiInputValidatorMessagesAggregator,
    omitByDefault: boolean,
  ) {
    this.userFacingFields = userFacingFields;
    this.#finalizerManager = finalizerManager;
    this.#multiFieldValidatorMessagesAggregator = multiFieldValidatorMessagesAggregator;
    this.#omitByDefault = omitByDefault;
    this.#omit = this.#omitByDefault;

    this.#multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(() => {
      this.stateChanges?.next(this.state);
    });

    this.#finalizerManager.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges?.next(this.state);
    });

    this.stateChanges = new BehaviorSubject(this.state);
  }

  reset() {
    this.#omit = this.#omitByDefault;
    for(const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }
}
