import type { State } from './state/state.interface';
import { ManagedSubject } from '../../subscriptions/managed-subject';

export interface Field {
  stateChanges : ManagedSubject<State>;
  state : State;
}