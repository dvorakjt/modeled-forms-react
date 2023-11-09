import { State } from '../state/state.interface';

export type SubmitFn = (state: State<any>) => Promise<any>;
