import { describe, test, expect } from 'vitest';
import { AggregatorFactoryImpl } from '../../../model/aggregators/aggregator-factory-impl';
import { getTestContainer } from '../test-container';
import { FormElementMap } from '../../../model/form-elements/form-element-map.type';
import { MockField } from '../../util/mocks/mock-field';
import { MultiFieldAggregatorImpl } from '../../../model/aggregators/multi-field-aggregator-impl';
import { MultiInputValidatorMessagesAggregatorImpl } from '../../../model/aggregators/multi-input-validator-messages-aggregator-impl';

describe('AggregatorFactoryImpl', () => {
  const container = getTestContainer();
  const proxyProducerFactory = container.services.ProxyProducerFactory;
  const reducerFactory = container.services.ReducerFactory;
  const emitterFactory = container.services.EmitterFactory;
  const subjectFactory = container.services.SubjectFactory;
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