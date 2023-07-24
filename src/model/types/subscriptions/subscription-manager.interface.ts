import { Observable, Subject } from "rxjs"
import { ManagedObservable } from "../../subscriptions/managed-observable"
import { ManagedSubject } from "../../subscriptions/managed-subject";

export interface SubscriptionManager {
  registerObservable : <T>(observable : Observable<T>) => ManagedObservable<T>;
  registerSubject : <T>(subject : Subject<T>) => ManagedSubject<T>;
  unsubscribeAll : () => void;
  count: number;
}