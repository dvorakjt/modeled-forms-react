import { AggregatorFactory } from "../../types/constituents/aggregators/aggregator-factory.interface";
import { MultiFieldAggregator } from "../../types/constituents/aggregators/multi-field-aggregator.interface";
import { MultiInputValidatorMessagesAggregator } from "../../types/constituents/aggregators/multi-input-validator-messages-aggregator.interface";
import { EmitterFactory } from "../../types/constituents/emitters/emitter-factory.interface";
import { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import { ProxyProducerFactory } from "../../types/constituents/proxies/proxy-producer-factory.interface";
import { ReducerFactory } from "../../types/constituents/reducers/reducer-factory.interface";
import { SubjectFactory } from "../../types/constituents/subjects/subject-factory.interface";
import { MultiInputValidator } from "../../types/constituents/validators/multi-input/multi-input-validator.interface";
import { MultiFieldAggregatorImpl } from "./multi-field-aggregator-impl";
import { MultiInputValidatorMessagesAggregatorImpl } from "./multi-input-validator-messages-aggregator-impl";

export class AggregatorFactoryImpl implements AggregatorFactory {
  #proxyProducerFactory : ProxyProducerFactory;
  #reducerFactory : ReducerFactory;
  #emitterFactory : EmitterFactory;
  #subjectFactory : SubjectFactory;

  constructor(
    proxyProducerFactory : ProxyProducerFactory,
    reducerFactory : ReducerFactory,
    emitterFactory : EmitterFactory,
    subjectFactory : SubjectFactory
  ) {
    this.#proxyProducerFactory = proxyProducerFactory;
    this.#reducerFactory = reducerFactory;
    this.#emitterFactory = emitterFactory;
    this.#subjectFactory = subjectFactory;
  }

  createMultiFieldAggregatorFromFields<Fields extends FormElementMap>(fields: Fields): MultiFieldAggregator<Fields> {
    return new MultiFieldAggregatorImpl<Fields>(
      fields,
      this.#proxyProducerFactory.createAggregatedStateChangesProxyProducer(),
      this.#reducerFactory.createFieldStateReducer(),
      this.#emitterFactory.createOneTimeValueEmitter<Set<string>>(),
      this.#subjectFactory
    );
  }
  createMultiInputValidatorMessagesAggregatorFromValidators(validators: MultiInputValidator[]): MultiInputValidatorMessagesAggregator {
    return new MultiInputValidatorMessagesAggregatorImpl(validators);
  }
  
}