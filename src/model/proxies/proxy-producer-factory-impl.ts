import { AggregatedStateChangesProxyProducer } from './aggregated-state-changes-proxy-producer.interface';
import {
  ProxyProducerFactory,
  ProxyProducerFactoryKey,
  ProxyProducerFactoryKeyType,
} from './proxy-producer-factory.interface';
import {
  ReducerFactory,
  ReducerFactoryKey,
} from '../reducers/reducer-factory.interface';
import { AggregatedStateChangesProxyProducerImpl } from './aggregated-state-changes-proxy-producer-impl';
import { autowire } from 'undecorated-di';

class ProxyProducerFactoryImpl implements ProxyProducerFactory {
  _reducerFactory: ReducerFactory;

  constructor(reducerFactory: ReducerFactory) {
    this._reducerFactory = reducerFactory;
  }

  createAggregatedStateChangesProxyProducer(): AggregatedStateChangesProxyProducer {
    return new AggregatedStateChangesProxyProducerImpl(
      this._reducerFactory.createFieldStateReducer(),
    );
  }
}

const ProxyProducerFactoryService = autowire<
  ProxyProducerFactoryKeyType,
  ProxyProducerFactory,
  ProxyProducerFactoryImpl
>(ProxyProducerFactoryImpl, ProxyProducerFactoryKey, [ReducerFactoryKey]);

export { ProxyProducerFactoryImpl, ProxyProducerFactoryService };
