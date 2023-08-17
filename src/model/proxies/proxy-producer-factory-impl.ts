import { AggregatedStateChangesProxyProducer } from "./aggregated-state-changes-proxy-producer.interface";
import { ProxyProducerFactory, ProxyProducerFactoryKey, ProxyProducerFactoryKeyType } from "./proxy-producer-factory.interface";
import { ReducerFactory, ReducerFactoryKey } from "../reducers/reducer-factory.interface";
import { AggregatedStateChangesProxyProducerImpl } from "./aggregated-state-changes-proxy-producer-impl";
import { autowire } from "undecorated-di";

export class ProxyProducerFactoryImpl implements ProxyProducerFactory {
  #reducerFactory : ReducerFactory;

  constructor(reducerFactory : ReducerFactory) {
    this.#reducerFactory = reducerFactory;
  }

  createAggregatedStateChangesProxyProducer(): AggregatedStateChangesProxyProducer {
    return new AggregatedStateChangesProxyProducerImpl(this.#reducerFactory.createFieldStateReducer());
  }
}

export default autowire<ProxyProducerFactoryKeyType, ProxyProducerFactory, ProxyProducerFactoryImpl>(
  ProxyProducerFactoryImpl,
  ProxyProducerFactoryKey,
  [
    ReducerFactoryKey
  ]
);