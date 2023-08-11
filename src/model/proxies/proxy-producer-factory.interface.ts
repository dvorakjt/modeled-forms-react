import { AggregatedStateChangesProxyProducer } from "./aggregated-state-changes-proxy-producer.interface";

export interface ProxyProducerFactory {
  createAggregatedStateChangesProxyProducer() : AggregatedStateChangesProxyProducer;
}