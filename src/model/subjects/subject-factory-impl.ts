import { makeInjectable } from "../util/make-injectable";
import { Services } from "../container";
import { EmitterFactory } from "../emitters/emitter-factory.interface";
import { OnInitialSubscriptionHandlingBehaviorSubject } from "./on-initial-subscription-handling-behavior-subject.interface";
import { SubjectFactory } from "../submission/subject-factory.interface";
import { OnInitialSubscriptionHandlingBehaviorSubjectImpl } from "./on-initial-subscription-handling-behavior-subject-impl";

class SubjectFactoryImpl implements SubjectFactory {
  #emitterFactory : EmitterFactory;

  constructor(emitterFactory : EmitterFactory) {
    this.#emitterFactory = emitterFactory;
  }

  createOnInitialSubscriptionHandlingBehaviorSubject<T>(initialValue: T): OnInitialSubscriptionHandlingBehaviorSubject<T> {
    return new OnInitialSubscriptionHandlingBehaviorSubjectImpl(initialValue, this.#emitterFactory.createOneTimeEventEmitter());
  }
}

makeInjectable(SubjectFactoryImpl, [Services.EmitterFactory]);

export { SubjectFactoryImpl };