import { FinalizerValidity } from './finalizer-validity.enum';

export interface FinalizerState {
  value?: any;
  finalizerValidity: FinalizerValidity;
}
