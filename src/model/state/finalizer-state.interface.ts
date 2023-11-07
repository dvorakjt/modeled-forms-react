import { FinalizerValidity } from './finalizer-validity.enum';
import { Modified } from './modified.enum';
import { Visited } from './visited.enum';

export type FinalizerState = {
  value?: any;
  finalizerValidity: FinalizerValidity;
  modified : Modified;
  visited : Visited;
}
