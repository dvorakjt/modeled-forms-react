import { ManagedObservable } from './managed-observable';
import { Subject } from 'rxjs';
import { List } from 'linked-list';
import { SubscriptionListItem } from './subscription-list-item';

export class ManagedSubject<T> extends ManagedObservable<T> {
  constructor(observable : Subject<T>, subscriptionList : List<SubscriptionListItem>) {
    super(observable, subscriptionList);
  }

  next(value : T) {
    return (this.observable as Subject<T>).next(value);
  }

  error(err : any) {
    return (this.observable as Subject<T>).error(err);
  }

  complete() {
    return (this.observable as Subject<T>).complete();
  }
}