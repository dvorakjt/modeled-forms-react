import { ManagedSubject } from '../../../model/subscriptions/managed-subject';
import type { FormStateManager } from '../../../model/types/forms/form-state-manager.interface';
import { State } from '../../../model/types/state/state.interface';
import { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';
import { Validity } from '../../../model/types/state/validity.enum';
import { BehaviorSubject } from 'rxjs';

export class FormStateManagerStub implements FormStateManager {
  static defaultState = {
    value: {},
    validity: Validity.PENDING,
    messages: [],
  };
  stateChanges: ManagedSubject<State<any>>;
  #state: State<any>;
  #subscriptionManager: SubscriptionManager;

  set state(state: State<any>) {
    this.#state = state;
    this.stateChanges.next(this.state);
  }

  get state() {
    return this.#state;
  }

  constructor(subscriptionManager: SubscriptionManager) {
    this.#subscriptionManager = subscriptionManager;
    this.#state = FormStateManagerStub.defaultState;
    this.stateChanges = this.#subscriptionManager.registerSubject(
      new BehaviorSubject(this.state),
    );
  }

  reset() {
    this.state = FormStateManagerStub.defaultState;
  }
}
