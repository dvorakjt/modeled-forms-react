import type { Observable, Subject, BehaviorSubject } from 'rxjs';
import type { ManagedObservable } from './managed-observable.interface';
import type { ManagedSubject } from './managed-subject.interface';
import type { OnInitialSubscriptionHandlingBehaviorSubject } from './on-initial-subscription-handling-behavior-subject.interface';

export interface ManagedObservableFactory {
  createManagedObservable<T>(observable: Observable<T>): ManagedObservable<T>;
  createManagedSubject<T>(subject: Subject<T>): ManagedSubject<T>;
  createOnInitialSubscriptionHandlingBehaviorSubject<T>(
    subject: BehaviorSubject<T>,
  ): OnInitialSubscriptionHandlingBehaviorSubject<T>;
}
