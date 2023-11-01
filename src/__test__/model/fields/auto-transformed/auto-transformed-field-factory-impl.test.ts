import { describe, test, expect } from 'vitest';
import { AutoTransformedFieldFactoryImpl } from '../../../../model/fields/auto-transformed/auto-transformed-field-factory-impl';
import { container } from '../../../../model/container';
import { MockField } from '../../../util/mocks/mock-field';
import { AutoTransformedField } from '../../../../model/fields/auto-transformed/auto-transformed-field';
import { Validity } from '../../../../model';

describe('AutoTransformedFieldFactoryImpl', () => {
  test('It instantiates an AutoTransformedField when createAutoTransformedField() is called.', () => {
    const autoTransformer = container.services.AutoTransformer;
    const autoTransformedFieldFactory = new AutoTransformedFieldFactoryImpl(autoTransformer);
    const baseField = new MockField('', Validity.VALID_FINALIZABLE);
    const autoTransformedField = autoTransformedFieldFactory.createAutoTransformedField(baseField);
    expect(autoTransformedField).toBeInstanceOf(AutoTransformedField);
  });
});