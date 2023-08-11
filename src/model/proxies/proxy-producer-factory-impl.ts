import { makeInjectable } from "../util/make-injectable";
import { Services } from "../container";
import { AggregatedStateChangesProxyProducer } from "./aggregated-state-changes-proxy-producer.interface";
import { ProxyProducerFactory } from "./proxy-producer-factory.interface";
import { ReducerFactory } from "../reducers/reducer-factory.interface";
import { AggregatedStateChangesProxyProducerImpl } from "./aggregated-state-changes-proxy-producer-impl";

class ProxyProducerFactoryImpl implements ProxyProducerFactory {
  #reducerFactory : ReducerFactory;

  constructor(reducerFactory : ReducerFactory) {
    this.#reducerFactory = reducerFactory;
  }

  createAggregatedStateChangesProxyProducer(): AggregatedStateChangesProxyProducer {
    return new AggregatedStateChangesProxyProducerImpl(this.#reducerFactory.createFieldStateReducer());
  }
}

makeInjectable(ProxyProducerFactoryImpl, [Services.ReducerFactory]);

export { ProxyProducerFactoryImpl };