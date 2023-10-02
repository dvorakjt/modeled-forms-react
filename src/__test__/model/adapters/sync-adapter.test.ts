import { describe, expect, test } from 'vitest';
import { SyncAdapter } from '../../../model/adapters/sync-adapter';
import { FormElementDictionary } from '../../../model/form-elements/form-element-dictionary.type';
import { MockField } from '../../util/mocks/mock-field';
import { AggregatedStateChanges } from '../../../model/aggregators/aggregated-state-changes.interface';
import { container } from '../../../model/container';

describe('SyncAdapter', () => {
  const aggregatorFactory = container.services.AggregatorFactory;

  test('It emits adapted values through its stream property.', () => {
    const fields: FormElementDictionary = {
      fieldA: new MockField('a field'),
    };
    const adapterFn = ({ fieldA }: AggregatedStateChanges) => {
      return fieldA.value.toUpperCase();
    };
    const syncAdapter = new SyncAdapter(
      adapterFn,
      aggregatorFactory.createMultiFieldAggregatorFromFields(fields),
    );
    syncAdapter.stream.subscribe(value => expect(value).toBe('A FIELD'));
  });

  test('It emits errors through its stream property if they are thrown by the adapterFn.', () => {
    const fields: FormElementDictionary = {
      fieldA: new MockField('a field'),
    };
    const expectedError = new Error();
    const adapterFn = () => {
      throw expectedError;
    };
    const syncAdapter = new SyncAdapter(
      adapterFn,
      aggregatorFactory.createMultiFieldAggregatorFromFields(fields),
    );
    syncAdapter.stream.subscribe({
      error: err => {
        expect(err).toBe(expectedError);
      },
    });
  });
});
