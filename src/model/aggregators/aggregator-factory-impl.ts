import {
  AggregatorFactory,
  AggregatorFactoryKey,
  AggregatorFactoryKeyType,
} from './aggregator-factory.interface';
import { MultiFieldAggregator } from './multi-field-aggregator.interface';
import { MultiInputValidatorMessagesAggregator } from './multi-input-validator-messages-aggregator.interface';
import {
  EmitterFactory,
  EmitterFactoryKey,
} from '../emitters/emitter-factory.interface';
import { FormElementDictionary } from '../form-elements/form-element-dictionary.type';
import {
  ProxyProducerFactory,
  ProxyProducerFactoryKey,
} from '../proxies/proxy-producer-factory.interface';
import {
  ReducerFactory,
  ReducerFactoryKey,
} from '../reducers/reducer-factory.interface';
import {
  SubjectFactory,
  SubjectFactoryKey,
} from '../subjects/subject-factory.interface';
import { MultiInputValidator } from '../validators/multi-input/multi-input-validator.interface';
import { MultiFieldAggregatorImpl } from './multi-field-aggregator-impl';
import { MultiInputValidatorMessagesAggregatorImpl } from './multi-input-validator-messages-aggregator-impl';
import { autowire } from 'undecorated-di';

class AggregatorFactoryImpl implements AggregatorFactory {
  _proxyProducerFactory: ProxyProducerFactory;
  _reducerFactory: ReducerFactory;
  _emitterFactory: EmitterFactory;
  _subjectFactory: SubjectFactory;

  constructor(
    proxyProducerFactory: ProxyProducerFactory,
    reducerFactory: ReducerFactory,
    emitterFactory: EmitterFactory,
    subjectFactory: SubjectFactory,
  ) {
    this._proxyProducerFactory = proxyProducerFactory;
    this._reducerFactory = reducerFactory;
    this._emitterFactory = emitterFactory;
    this._subjectFactory = subjectFactory;
  }

  createMultiFieldAggregatorFromFields(
    fields: FormElementDictionary,
  ): MultiFieldAggregator {
    return new MultiFieldAggregatorImpl(
      fields,
      this._proxyProducerFactory.createAggregatedStateChangesProxyProducer(),
      this._reducerFactory.createFieldStateReducer(),
      this._emitterFactory.createOneTimeValueEmitter<Set<string>>(),
      this._subjectFactory,
    );
  }
  createMultiInputValidatorMessagesAggregatorFromValidators(
    validators: MultiInputValidator[],
  ): MultiInputValidatorMessagesAggregator {
    return new MultiInputValidatorMessagesAggregatorImpl(validators);
  }
}

const AggregatorFactoryService = autowire<
  AggregatorFactoryKeyType,
  AggregatorFactory,
  AggregatorFactoryImpl
>(AggregatorFactoryImpl, AggregatorFactoryKey, [
  ProxyProducerFactoryKey,
  ReducerFactoryKey,
  EmitterFactoryKey,
  SubjectFactoryKey,
]);

export { AggregatorFactoryImpl, AggregatorFactoryService };
