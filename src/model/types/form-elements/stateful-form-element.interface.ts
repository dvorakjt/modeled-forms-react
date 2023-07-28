import type { State } from '../state/state.interface';
import type { ManagedSubject } from '../subscriptions/managed-subject.interface';

export interface StatefulFormElement<T> {
  stateChanges: ManagedSubject<State<T>>;
  get state(): State<T>;
}
