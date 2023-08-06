import { EmitterFactory } from "../types/emitters/emitter-factory.interface";
import { OnInitialSubscriptionHandlingBehaviorSubject } from "../types/subjects/on-initial-subscription-handling-behavior-subject.interface";
import { SubjectFactory } from "../types/subjects/subject-factory.interface";
import { OnInitialSubscriptionHandlingBehaviorSubjectImpl } from "./on-initial-subscription-handling-behavior-subject-impl";

export class SubjectFactoryImpl implements SubjectFactory {
  #emitterFactory : EmitterFactory;

  constructor(emitterFactory : EmitterFactory) {
    this.#emitterFactory = emitterFactory;
  }

  createOnInitialSubscriptionHandlingBehaviorSubject<T>(initialValue: T): OnInitialSubscriptionHandlingBehaviorSubject<T> {
    return new OnInitialSubscriptionHandlingBehaviorSubjectImpl(initialValue, this.#emitterFactory.createOneTimeEventEmitter());
  }
}