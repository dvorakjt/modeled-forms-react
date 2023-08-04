import { Subject } from 'rxjs';
import type { State } from '../state/state.interface';

export interface StatefulFormElement<T> {
  stateChanges: Subject<State<T>>;
  get state(): State<T>;
}
