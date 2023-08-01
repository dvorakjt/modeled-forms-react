import { BehaviorSubject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import type { NestedForm } from '../types/forms/nested-form.interface';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { State } from '../types/state/state.interface';
import { FinalizerManager } from '../types/finalizers/finalizer-manager.interface';
import { FormElementMap } from '../types/form-elements/form-element-map.type';
import { MultiFieldValidatorMessagesAggregator } from '../types/aggregators/multi-field-validator-messages-aggregator';

export class NestedFormImpl implements NestedForm {
  readonly stateChanges: ManagedSubject<State<any>>;
  readonly userFacingFields : FormElementMap;
  readonly #finalizerManager : FinalizerManager;
  readonly #multiFieldValidatorMessagesAggregator : MultiFieldValidatorMessagesAggregator;
  readonly #managedObservableFactory: ManagedObservableFactory;
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
    multiFieldValidatorMessagesAggregator : MultiFieldValidatorMessagesAggregator,
    managedObservableFactory: ManagedObservableFactory,
    omitByDefault: boolean,
  ) {
    this.userFacingFields = userFacingFields;
    this.#finalizerManager = finalizerManager;
    this.#multiFieldValidatorMessagesAggregator = multiFieldValidatorMessagesAggregator;
    this.#managedObservableFactory = managedObservableFactory;
    this.#omitByDefault = omitByDefault;
    this.#omit = this.#omitByDefault;

    this.#multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(() => {
      this.stateChanges?.next(this.state);
    });

    this.#finalizerManager.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges?.next(this.state);
    });

    this.stateChanges = this.#managedObservableFactory.createManagedSubject(
      new BehaviorSubject(this.state),
    );
  }

  reset() {
    this.#omit = this.#omitByDefault;
    for(const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }
}
