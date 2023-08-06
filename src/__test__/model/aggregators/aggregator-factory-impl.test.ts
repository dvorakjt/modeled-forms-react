import { describe, test, expect } from 'vitest';
import { AggregatorFactoryImpl } from '../../../model/aggregators/aggregator-factory-impl';
import { getTestContainer, Services } from '../test-container';
import { ProxyProducerFactory } from '../../../model/types/proxies/proxy-producer-factory.interface';
import { ReducerFactory } from '../../../model/types/reducers/reducer-factory.interface';
import { EmitterFactory } from '../../../model/types/emitters/emitter-factory.interface';
import { SubjectFactory } from '../../../model/types/subjects/subject-factory.interface';
import { FormElementMap } from '../../../model/types/form-elements/form-element-map.type';
import { MockField } from '../../util/mocks/mock-field';
import { MultiFieldAggregatorImpl } from '../../../model/aggregators/multi-field-aggregator-impl';
import { MultiInputValidatorMessagesAggregatorImpl } from '../../../model/aggregators/multi-input-validator-messages-aggregator-impl';

describe('AggregatorFactoryImpl', () => {
  const container = getTestContainer();
  const proxyProducerFactory = container.get<ProxyProducerFactory>(Services.ProxyProducerFactory);
  const reducerFactory = container.get<ReducerFactory>(Services.ReducerFactory);
  const emitterFactory = container.get<EmitterFactory>(Services.EmitterFactory);
  const subjectFactory = container.get<SubjectFactory>(Services.SubjectFactory);
  const aggregatorFactoryImpl = new AggregatorFactoryImpl(
    proxyProducerFactory,
    reducerFactory,
    emitterFactory,
    subjectFactory
  );

  test('It returns an instance of MultiFieldAggregator when createMultiFieldAggregatorFromFields() is called.', () => {
    const fields : FormElementMap = {
      fieldA : new MockField('a field')
    }
    const multiFieldAggregator = aggregatorFactoryImpl.createMultiFieldAggregatorFromFields(fields);
    expect(multiFieldAggregator).toBeInstanceOf(MultiFieldAggregatorImpl);
  });

  test('It returns an instance of MultiInputValidatorMessagesAggregator when createMultiInputValidatorMessagesAggregatorFromValidators() is called.', () => {
    const multiInputValidatorMessagesAggregator = aggregatorFactoryImpl.createMultiInputValidatorMessagesAggregatorFromValidators([]);
    expect(multiInputValidatorMessagesAggregator).toBeInstanceOf(MultiInputValidatorMessagesAggregatorImpl);
  });
});