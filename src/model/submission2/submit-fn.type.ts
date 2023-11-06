import { State } from "../state/state.interface";

export type SubmitFn<T> = (state : State<any>) => Promise<T>;