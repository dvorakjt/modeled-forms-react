import { AggregatedStateChangesProxyProducer } from "../types/proxies/aggregated-state-changes-proxy-producer.interface";
import { ProxyProducerFactory } from "../types/proxies/proxy-producer-factory.interface";
import { ReducerFactory } from "../types/reducers/reducer-factory.interface";
import { AggregatedStateChangesProxyProducerImpl } from "./aggregated-state-changes-proxy-producer-impl";

export class ProxyProducerFactoryImpl implements ProxyProducerFactory {
  #reducerFactory : ReducerFactory;

  constructor(reducerFactory : ReducerFactory) {
    this.#reducerFactory = reducerFactory;
  }

  createAggregatedStateChangesProxyProducer(): AggregatedStateChangesProxyProducer {
    return new AggregatedStateChangesProxyProducerImpl(this.#reducerFactory.createFieldStateReducer());
  }
}