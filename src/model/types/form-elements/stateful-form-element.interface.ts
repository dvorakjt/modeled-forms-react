import type { State } from '../state/state.interface';
import { ManagedSubject } from '../../subscriptions/managed-subject';

export interface StatefulFormElement<T> {
  stateChanges? : ManagedSubject<State<T>>;
  get state() : State<T>;
}