import type { FormElementMap } from '../form-elements/form-element-map.type';
import type { AnyState } from '../state/any-state.type';
import type { Validity } from '../state/validity.enum';

interface OverallValidity {
  overallValidity: Validity;
  hasOmittedFields: boolean;
}


export type AggregatedStateChanges = Omit<
  {
    [K in keyof FormElementMap]: AnyState;
  },
  keyof OverallValidity
> &
  OverallValidity;
