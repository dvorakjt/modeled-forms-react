import type { ManagedSubject } from '../subscriptions/managed-subject.interface';

export interface Adapter<T> {
  stream: ManagedSubject<T>;
}
