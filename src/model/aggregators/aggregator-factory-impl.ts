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
import { FormElementMap } from '../form-elements/form-element-map.type';
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
  #proxyProducerFactory: ProxyProducerFactory;
  #reducerFactory: ReducerFactory;
  #emitterFactory: EmitterFactory;
  #subjectFactory: SubjectFactory;

  constructor(
    proxyProducerFactory: ProxyProducerFactory,
    reducerFactory: ReducerFactory,
    emitterFactory: EmitterFactory,
    subjectFactory: SubjectFactory,
  ) {
    this.#proxyProducerFactory = proxyProducerFactory;
    this.#reducerFactory = reducerFactory;
    this.#emitterFactory = emitterFactory;
    this.#subjectFactory = subjectFactory;
  }

  createMultiFieldAggregatorFromFields(
    fields: FormElementMap,
  ): MultiFieldAggregator {
    return new MultiFieldAggregatorImpl(
      fields,
      this.#proxyProducerFactory.createAggregatedStateChangesProxyProducer(),
      this.#reducerFactory.createFieldStateReducer(),
      this.#emitterFactory.createOneTimeValueEmitter<Set<string>>(),
      this.#subjectFactory,
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
