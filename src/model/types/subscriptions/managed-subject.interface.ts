import type { ManagedObservable } from './managed-observable.interface';

export interface ManagedSubject<T> extends ManagedObservable<T> {
  next(value: T): void;
  error(err: any): void;
  complete(): void;
}
