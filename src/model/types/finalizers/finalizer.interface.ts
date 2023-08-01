import { Adapter } from "../adapters/adapter.interface";
import { FinalizerState } from "../state/finalizer-state.interface";

export type Finalizer = Adapter<FinalizerState>