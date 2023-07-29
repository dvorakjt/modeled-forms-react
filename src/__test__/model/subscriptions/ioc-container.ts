import { OneTimeEventEmitterFactoryImpl } from "../../../model/subscriptions/one-time-event-emitter-factory-impl";
import { ManagedSubscriptionFactoryImpl } from "../../../model/subscriptions/managed-subscription-factory-impl";
import { SubscriptionManagerImpl } from "../../../model/subscriptions/subscription-manager-impl";
import { ManagedSubscriptionListImpl } from "../../../model/subscriptions/managed-subscription-list-impl";
import { ManagedObservableFactoryImpl } from "../../../model/subscriptions/managed-observable-factory-impl";
import type { OneTimeEventEmitterFactory } from "../../../model/types/subscriptions/one-time-event-emitter-factory.interface"
import type { ManagedSubscriptionFactory } from "../../../model/types/subscriptions/managed-subscription-factory.interface";
import type { ManagedSubscriptionList } from "../../../model/types/subscriptions/managed-subscription-list.interface";
import type { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import type { ManagedObservableFactory } from "../../../model/types/subscriptions/managed-observable-factory.interface";

const iocContainer = {
  get OneTimeEventEmitterFactory() : OneTimeEventEmitterFactory {
    return new OneTimeEventEmitterFactoryImpl();
  },
  get ManagedSubscriptionList() : ManagedSubscriptionList {
    return new ManagedSubscriptionListImpl()
  },
  get ManagedSubscriptionFactory() : ManagedSubscriptionFactory {
    return new ManagedSubscriptionFactoryImpl(iocContainer.OneTimeEventEmitterFactory);
  },
  get SubscriptionManager() : SubscriptionManager {
    return new SubscriptionManagerImpl(iocContainer.ManagedSubscriptionFactory, iocContainer.ManagedSubscriptionList);
  },
  get ManagedObservableFactory() : ManagedObservableFactory {
    return new ManagedObservableFactoryImpl(iocContainer.SubscriptionManager, iocContainer.OneTimeEventEmitterFactory)
  }
}

export { iocContainer };