import { OnInitialSubscriptionHandlingBehaviorSubject } from './on-initial-subscription-handling-behavior-subject.interface';

interface SubjectFactory {
  createOnInitialSubscriptionHandlingBehaviorSubject<T>(
    initialValue: T,
  ): OnInitialSubscriptionHandlingBehaviorSubject<T>;
}
const SubjectFactoryKey = 'SubjectFactory';
type SubjectFactoryKeyType = typeof SubjectFactoryKey;

export { SubjectFactoryKey, type SubjectFactory, type SubjectFactoryKeyType };
