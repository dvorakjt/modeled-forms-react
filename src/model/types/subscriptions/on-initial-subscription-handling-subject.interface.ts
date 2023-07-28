import type { ManagedSubject } from './managed-subject.interface';

export interface OnInitialSubscriptionHandlingSubject<T>
  extends ManagedSubject<T> {
  onInitialSubscription(cb: () => void): void;
}
