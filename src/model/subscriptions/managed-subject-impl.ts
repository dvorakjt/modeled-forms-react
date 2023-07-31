import { ManagedObservableImpl } from './managed-observable-impl';
import type { Subject } from 'rxjs';
import type { ManagedSubject } from '../types/subscriptions/managed-subject.interface';
import type { SubscriptionManager } from '../types/subscriptions/subscription-manager.interface';

export class ManagedSubjectImpl<T>
  extends ManagedObservableImpl<T>
  implements ManagedSubject<T>
{
  private get subject() {
    return this.observable as Subject<T>;
  }

  constructor(subject: Subject<T>, subscriptionManager: SubscriptionManager) {
    super(subject, subscriptionManager);
  }

  next(value: T) {
    this.subject.next(value);
  }

  error(err: any): void {
    this.subject.error(err);
  }

  complete(): void {
    this.subject.complete();
  }
}
