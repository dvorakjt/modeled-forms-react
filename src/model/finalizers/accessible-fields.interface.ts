import { OneTimeValueEmitter } from "../emitters/one-time-value-emitter.interface";

export interface AccessibleFields {
  accessedFields : OneTimeValueEmitter<Set<string>>;
}