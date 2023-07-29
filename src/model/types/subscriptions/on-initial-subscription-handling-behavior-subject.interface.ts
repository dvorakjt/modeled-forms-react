import type { ManagedSubject } from './managed-subject.interface';

export interface OnInitialSubscriptionHandlingBehaviorSubject<T>
  extends ManagedSubject<T> {
  onInitialSubscription(cb: () => void): void;
}
