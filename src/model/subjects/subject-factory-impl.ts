import {
  EmitterFactory,
  EmitterFactoryKey,
} from '../emitters/emitter-factory.interface';
import { OnInitialSubscriptionHandlingBehaviorSubject } from './on-initial-subscription-handling-behavior-subject.interface';
import {
  SubjectFactory,
  SubjectFactoryKey,
  SubjectFactoryKeyType,
} from './subject-factory.interface';
import { OnInitialSubscriptionHandlingBehaviorSubjectImpl } from './on-initial-subscription-handling-behavior-subject-impl';
import { autowire } from 'undecorated-di';

class SubjectFactoryImpl implements SubjectFactory {
  _emitterFactory: EmitterFactory;

  constructor(emitterFactory: EmitterFactory) {
    this._emitterFactory = emitterFactory;
  }

  createOnInitialSubscriptionHandlingBehaviorSubject<T>(
    initialValue: T,
  ): OnInitialSubscriptionHandlingBehaviorSubject<T> {
    return new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
      initialValue,
      this._emitterFactory.createOneTimeEventEmitter(),
    );
  }
}

const SubjectFactoryService = autowire<
  SubjectFactoryKeyType,
  SubjectFactory,
  SubjectFactoryImpl
>(SubjectFactoryImpl, SubjectFactoryKey, [EmitterFactoryKey]);

export { SubjectFactoryImpl, SubjectFactoryService };
