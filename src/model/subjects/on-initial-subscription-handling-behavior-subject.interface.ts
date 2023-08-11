import type { BehaviorSubject } from 'rxjs';

export interface OnInitialSubscriptionHandlingBehaviorSubject<T>
  extends BehaviorSubject<T> {
  onInitialSubscription(cb: () => void): void;
}
