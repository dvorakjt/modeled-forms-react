import { BehaviorSubject } from 'rxjs';
import { copyObject } from '../util/copy-object';
import type { NestedForm } from '../types/forms/nested-form.interface';
import type { ManagedObservableFactory } from '../types/subscriptions/managed-observable-factory.interface';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { State } from '../types/state/state.interface';
import type { FormStateManager } from '../types/forms/form-state-manager.interface';

export class NestedFormImpl implements NestedForm {
  readonly stateChanges: ManagedSubject<State<any>>;
  readonly #formStateManager: FormStateManager;
  readonly #managedObservableFactory: ManagedObservableFactory;
  readonly #omitByDefault;
  #omit;

  get state() {
    return copyObject({
      ...this.#formStateManager.state,
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
    formStateManager: FormStateManager,
    managedObservableFactory: ManagedObservableFactory,
    omitByDefault: boolean,
  ) {
    this.#formStateManager = formStateManager;
    this.#managedObservableFactory = managedObservableFactory;
    this.#omitByDefault = omitByDefault;
    this.#omit = this.#omitByDefault;

    this.#formStateManager.stateChanges.subscribe(() => {
      if (this.stateChanges) this.stateChanges?.next(this.state);
    });

    this.stateChanges = this.#managedObservableFactory.createManagedSubject(
      new BehaviorSubject(this.state),
    );
  }

  reset() {
    this.#omit = this.#omitByDefault;
    this.#formStateManager.reset();
  }
}
