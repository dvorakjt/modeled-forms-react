import type { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import type { AnyState } from '../state/any-state.type';
import type { Modified } from '../state/modified.enum';
import type { Validity } from '../state/validity.enum';
import type { Visited } from '../state/visited.enum';

interface ReducedState {
  overallValidity(): Validity;
  modified() : Modified;
  visited() : Visited;
  hasOmittedFields(): boolean;
}

export type AggregatedStateChanges = Omit<
  {
    [K in keyof FormElementDictionary]: AnyState;
  },
  keyof ReducedState
> &
  ReducedState;
