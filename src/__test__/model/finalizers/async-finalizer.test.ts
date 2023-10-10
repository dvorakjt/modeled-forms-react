import { describe, test, expect } from 'vitest';
import { AsyncFinalizer } from '../../../model/finalizers/async-finalizer';
import { container } from '../../../model/container';
import { MockField } from '../../util/mocks/mock-field';
import { Validity } from '../../../model';
import { AsyncBaseFinalizerFn } from '../../../model/finalizers/finalizer-functions/async-base-finalizer-fn.type';

describe('AsyncFinalizer', () => {
  test('AccessedFields returns the field names that were accessed by the finalizer.', () => {
    const fieldA = new MockField('', Validity.VALID_FINALIZABLE);
    const fieldB = new MockField('', Validity.VALID_FINALIZABLE);
    const fieldC = new MockField('', Validity.VALID_FINALIZABLE);
    const fields = { fieldA, fieldB, fieldC };

    const baseFinalizerFn : AsyncBaseFinalizerFn = ({ fieldA, fieldB }) => {
      return new Promise<string>((resolve) => {
        resolve(fieldA.value + ' ' + fieldB.value);
      });
    }

    const finalizerFn = container.services.FinalizerFnFactory.createAsyncFinalizerFn(baseFinalizerFn);
    const multiFieldAggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    const asyncFinalizer = new AsyncFinalizer(finalizerFn, multiFieldAggregator);
    asyncFinalizer.accessedFields.onValue((accessedFields) => {
      expect(accessedFields.has('fieldA')).toBe(true);
      expect(accessedFields.has('fieldB')).toBe(true);
      expect(accessedFields.has('fieldC')).toBe(false);
    })
  });
});