import type { FieldState } from './field-state.interface';
import type { State } from './state.interface';

export type AnyState = State<any> | FieldState;