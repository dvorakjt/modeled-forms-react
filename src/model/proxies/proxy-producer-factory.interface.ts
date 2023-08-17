import { AggregatedStateChangesProxyProducer } from './aggregated-state-changes-proxy-producer.interface';

interface ProxyProducerFactory {
  createAggregatedStateChangesProxyProducer(): AggregatedStateChangesProxyProducer;
}
const ProxyProducerFactoryKey = 'ProxyProducerFactory';
type ProxyProducerFactoryKeyType = typeof ProxyProducerFactoryKey;

export {
  ProxyProducerFactoryKey,
  type ProxyProducerFactory,
  type ProxyProducerFactoryKeyType,
};
