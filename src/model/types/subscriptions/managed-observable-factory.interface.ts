import type { Observable, Subject } from 'rxjs';
import type { ManagedObservable } from './managed-observable.interface';
import type { ManagedSubject } from './managed-subject.interface';
import type { OnInitialSubscriptionHandlingSubject } from './on-initial-subscription-handling-subject.interface';

export interface ManagedObservableFactory {
  createManagedObservable<T>(observable: Observable<T>): ManagedObservable<T>;
  createManagedSubject<T>(subject: Subject<T>): ManagedSubject<T>;
  createOnInitialSubscriptionHandlingSubject<T>(
    subject: Subject<T>,
  ): OnInitialSubscriptionHandlingSubject<T>;
}
