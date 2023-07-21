import { Observable } from "rxjs"
import { ManagedObservable } from "./managed-observable"

export interface SubscriptionManager {
  registerObservable : <T>(observable : Observable<T>) => ManagedObservable<T>;
  unsubscribeAll : () => void;
  count: number;
}