import { describe, test, expect } from 'vitest';
import { AdapterFactoryImpl } from '../../../model/adapters/adapter-factory-impl';
import { getTestContainer } from '../test-container';
import { MockField } from '../../util/mocks/mock-field';
import { Validity } from '../../../model';
import { SyncAdapterFn } from '../../../model/adapters/sync-adapter-fn.type';
import { SyncAdapter } from '../../../model/adapters/sync-adapter';
import { AsyncAdapterFn } from '../../../model/adapters/async-adapter-fn.type';
import { AsyncAdapter } from '../../../model/adapters/async-adapter';

describe('AdapterFactoryImpl', () => {
  const container = getTestContainer();
  const fields = {
    fieldA : new MockField('', Validity.VALID_FINALIZABLE),
    fieldB : new MockField('', Validity.VALID_FINALIZABLE)
  }
  const aggregatorFactory = container.services.AggregatorFactory;
  const adapterFactory = new AdapterFactoryImpl(aggregatorFactory);

  test('It returns an instance of SyncAdapter when createSyncAdapterFromFnWithFields is called.', () => {
    const testSyncFn : SyncAdapterFn<string> = ({ fieldA, fieldB}) => fieldA + ' ' + fieldB;
    const syncAdapter = adapterFactory.createSyncAdapterFromFnWithFields<string>(testSyncFn, fields);
    expect(syncAdapter).toBeInstanceOf(SyncAdapter);
  });

  test('It returns an instance of AsyncAdapter when createAsyncAdapterFromFnWithFields is called.', () => {
    const testAsyncFn : AsyncAdapterFn<string> = ({ fieldA, fieldB }) => {
      return new Promise<string>((resolve) => {
        resolve(fieldA + ' ' + fieldB);
      });
    }
    const asyncAdapter = adapterFactory.createAsyncAdapterFromFnWithFields(testAsyncFn, fields);
    expect(asyncAdapter).toBeInstanceOf(AsyncAdapter);
  });
});