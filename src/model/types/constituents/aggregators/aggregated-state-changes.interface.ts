import type { FormElementMap } from '../form-elements/form-element-map.type';
import type { OverallValidity } from './overall-validity.interface';
import type { AnyState } from '../state/any-state.type';

export type AggregatedStateChanges<Fields extends FormElementMap> = Omit<
  {
    [K in keyof Fields]: AnyState;
  },
  keyof OverallValidity
> &
  OverallValidity;
