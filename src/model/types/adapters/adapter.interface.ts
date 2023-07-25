import { ManagedSubject } from "../../subscriptions/managed-subject";

export interface Adapter<T> {
  stream : ManagedSubject<T>
}