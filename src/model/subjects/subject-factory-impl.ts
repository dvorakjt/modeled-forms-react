import { EmitterFactory, EmitterFactoryKey } from "../emitters/emitter-factory.interface";
import { OnInitialSubscriptionHandlingBehaviorSubject } from "./on-initial-subscription-handling-behavior-subject.interface";
import { SubjectFactory, SubjectFactoryKey, SubjectFactoryKeyType } from "./subject-factory.interface";
import { OnInitialSubscriptionHandlingBehaviorSubjectImpl } from "./on-initial-subscription-handling-behavior-subject-impl";
import { autowire } from "undecorated-di";

export class SubjectFactoryImpl implements SubjectFactory {
  #emitterFactory : EmitterFactory;

  constructor(emitterFactory : EmitterFactory) {
    this.#emitterFactory = emitterFactory;
  }

  createOnInitialSubscriptionHandlingBehaviorSubject<T>(initialValue: T): OnInitialSubscriptionHandlingBehaviorSubject<T> {
    return new OnInitialSubscriptionHandlingBehaviorSubjectImpl(initialValue, this.#emitterFactory.createOneTimeEventEmitter());
  }
}

export default autowire<SubjectFactoryKeyType, SubjectFactory, SubjectFactoryImpl>(
  SubjectFactoryImpl,
  SubjectFactoryKey,
  [
    EmitterFactoryKey
  ]
);