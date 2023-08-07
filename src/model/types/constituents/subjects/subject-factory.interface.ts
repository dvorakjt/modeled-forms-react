import { OnInitialSubscriptionHandlingBehaviorSubject } from "./on-initial-subscription-handling-behavior-subject.interface";

export interface SubjectFactory {
  createOnInitialSubscriptionHandlingBehaviorSubject<T>(initialValue : T) : OnInitialSubscriptionHandlingBehaviorSubject<T>;
}