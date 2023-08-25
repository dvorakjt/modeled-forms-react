import type { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import type { AnyState } from '../state/any-state.type';
import type { Validity } from '../state/validity.enum';

interface OverallValidity {
  overallValidity(): Validity;
  hasOmittedFields(): boolean;
}

export type AggregatedStateChanges = Omit<
  {
    [K in keyof FormElementDictionary]: AnyState;
  },
  keyof OverallValidity
> &
  OverallValidity;
