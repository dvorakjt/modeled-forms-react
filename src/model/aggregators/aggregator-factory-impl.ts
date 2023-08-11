import { makeInjectable } from "../util/make-injectable";
import { Services } from "../container";
import { AggregatorFactory } from "./aggregator-factory.interface";
import { MultiFieldAggregator } from "./multi-field-aggregator.interface";
import { MultiInputValidatorMessagesAggregator } from "./multi-input-validator-messages-aggregator.interface";
import { EmitterFactory } from "../emitters/emitter-factory.interface";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { ProxyProducerFactory } from "../proxies/proxy-producer-factory.interface";
import { ReducerFactory } from "../reducers/reducer-factory.interface";
import { SubjectFactory } from "../submission/subject-factory.interface";
import { MultiInputValidator } from "../validators/multi-input/multi-input-validator.interface";
import { MultiFieldAggregatorImpl } from "./multi-field-aggregator-impl";
import { MultiInputValidatorMessagesAggregatorImpl } from "./multi-input-validator-messages-aggregator-impl";

class AggregatorFactoryImpl implements AggregatorFactory {
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

  createMultiFieldAggregatorFromFields(fields: FormElementMap): MultiFieldAggregator {
    return new MultiFieldAggregatorImpl(
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

makeInjectable(AggregatorFactoryImpl, [Services.ProxyProducerFactory, Services.ReducerFactory, Services.EmitterFactory, Services.SubjectFactory]);

export { AggregatorFactoryImpl };