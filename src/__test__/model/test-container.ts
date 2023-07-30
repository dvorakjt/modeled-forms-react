import 'reflect-metadata';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import { OneTimeEventEmitterFactoryImpl } from '../../model/subscriptions/one-time-event-emitter-factory-impl';
import { ManagedSubscriptionFactoryImpl } from '../../model/subscriptions/managed-subscription-factory-impl';
import { SubscriptionManagerImpl } from '../../model/subscriptions/subscription-manager-impl';
import { ManagedSubscriptionListImpl } from '../../model/subscriptions/managed-subscription-list-impl';
import { ManagedObservableFactoryImpl } from '../../model/subscriptions/managed-observable-factory-impl';
import type { OneTimeEventEmitterFactory } from '../../model/types/subscriptions/one-time-event-emitter-factory.interface';
import type { ManagedSubscriptionFactory } from '../../model/types/subscriptions/managed-subscription-factory.interface';
import type { ManagedSubscriptionList } from '../../model/types/subscriptions/managed-subscription-list.interface';
import type { SubscriptionManager } from '../../model/types/subscriptions/subscription-manager.interface';
import type { ManagedObservableFactory } from '../../model/types/subscriptions/managed-observable-factory.interface';

export enum Services {
  OneTimeEventEmitterFactory = 'OneTimeEventEmitterFactory',
  ManagedSubscriptionList = 'ManagedSubscriptionList',
  ManagedSubscriptionFactory = 'ManagedSubscriptionFactory',
  SubscriptionManager = 'SubscriptionManager',
  ManagedObservableFactory = 'ManagedObservableFactory',
}

export function getTestContainer() {
  helpers.annotate(OneTimeEventEmitterFactoryImpl);
  helpers.annotate(ManagedSubscriptionListImpl);
  helpers.annotate(ManagedSubscriptionFactoryImpl, [
    Services.OneTimeEventEmitterFactory,
  ]);
  helpers.annotate(SubscriptionManagerImpl, [
    Services.ManagedSubscriptionFactory,
    Services.ManagedSubscriptionList,
  ]);
  helpers.annotate(ManagedObservableFactoryImpl, [
    Services.SubscriptionManager,
    Services.OneTimeEventEmitterFactory,
  ]);

  const container = new Container();
  container
    .bind<OneTimeEventEmitterFactory>(Services.OneTimeEventEmitterFactory)
    .to(OneTimeEventEmitterFactoryImpl)
    .inTransientScope();
  container
    .bind<ManagedSubscriptionList>(Services.ManagedSubscriptionList)
    .to(ManagedSubscriptionListImpl)
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
