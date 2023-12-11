import { FinalizerValidity } from './finalizer-validity.enum';
import { Modified } from './modified.enum';
import { Visited } from './visited.enum';
import { Focused } from './focused.enum';

export type FinalizerState = {
  value?: any;
  finalizerValidity: FinalizerValidity;
  modified: Modified;
  visited: Visited;
  focused : Focused;
};
