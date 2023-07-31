import 'reflect-metadata';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import { OneTimeEmitterFactoryImpl } from '../../model/subscriptions/one-time-event-emitter-factory-impl';
import { ManagedSubscriptionFactoryImpl } from '../../model/subscriptions/managed-subscription-factory-impl';
import { SubscriptionManagerImpl } from '../../model/subscriptions/subscription-manager-impl';
import { ManagedSubscriptionListImpl } from '../../model/subscriptions/managed-subscription-list-impl';
import { ManagedObservableFactoryImpl } from '../../model/subscriptions/managed-observable-factory-impl';
import { ValidityReducerImpl } from '../../model/reducers/validity-reducer-impl';
import type { OneTimeEmitterFactory } from '../../model/types/subscriptions/one-time-emitter-factory.interface';
import type { ManagedSubscriptionFactory } from '../../model/types/subscriptions/managed-subscription-factory.interface';
import type { ManagedSubscriptionList } from '../../model/types/subscriptions/managed-subscription-list.interface';
import type { SubscriptionManager } from '../../model/types/subscriptions/subscription-manager.interface';
import type { ManagedObservableFactory } from '../../model/types/subscriptions/managed-observable-factory.interface';
import type { ValidityReducer } from '../../model/types/reducers/validity-reducer.interface';

export enum Services {
  OneTimeEmitterFactory = 'OneTimeEmitterFactory',
  ManagedSubscriptionList = 'ManagedSubscriptionList',
  ManagedSubscriptionFactory = 'ManagedSubscriptionFactory',
  SubscriptionManager = 'SubscriptionManager',
  ManagedObservableFactory = 'ManagedObservableFactory',
  ValidityReducer = 'ValidityReducer'
}

export function getTestContainer() {
  helpers.annotate(OneTimeEmitterFactoryImpl);
  helpers.annotate(ManagedSubscriptionListImpl);
  helpers.annotate(ValidityReducerImpl);
  helpers.annotate(ManagedSubscriptionFactoryImpl, [
    Services.OneTimeEmitterFactory,
  ]);
  helpers.annotate(SubscriptionManagerImpl, [
    Services.ManagedSubscriptionFactory,
    Services.ManagedSubscriptionList,
  ]);
  helpers.annotate(ManagedObservableFactoryImpl, [
    Services.SubscriptionManager,
    Services.OneTimeEmitterFactory,
  ]);

  const container = new Container();
  container
    .bind<OneTimeEmitterFactory>(Services.OneTimeEmitterFactory)
    .to(OneTimeEmitterFactoryImpl)
    .inTransientScope();
  container
    .bind<ManagedSubscriptionList>(Services.ManagedSubscriptionList)
    .to(ManagedSubscriptionListImpl)
    .inTransientScope();
  container
    .bind<ValidityReducer>(Services.ValidityReducer)
    .to(ValidityReducerImpl)
    .inTransientScope();
  container
    .bind<ManagedSubscriptionFactory>(Services.ManagedSubscriptionFactory)
    .to(ManagedSubscriptionFactoryImpl)
    .inTransientScope();
  container
    .bind<SubscriptionManager>(Services.SubscriptionManager)
    .to(SubscriptionManagerImpl)
    .inSingletonScope();
  container
    .bind<ManagedObservableFactory>(Services.ManagedObservableFactory)
    .to(ManagedObservableFactoryImpl)
    .inSingletonScope();

  return container;
}
