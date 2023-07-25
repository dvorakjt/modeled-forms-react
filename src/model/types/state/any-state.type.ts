import { DualFieldState } from "./dual-field-state.interface";
import { FieldState } from "./field-state.interface";
import { State } from "./state.interface";

export type AnyState = State<any> | FieldState | DualFieldState;