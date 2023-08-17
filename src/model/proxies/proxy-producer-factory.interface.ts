import { AggregatedStateChangesProxyProducer } from "./aggregated-state-changes-proxy-producer.interface";

export interface ProxyProducerFactory {
  createAggregatedStateChangesProxyProducer() : AggregatedStateChangesProxyProducer;
}

export const ProxyProducerFactoryKey = 'ProxyProducerFactory';

export type ProxyProducerFactoryKeyType = typeof ProxyProducerFactoryKey;