import { describe, test, expect } from 'vitest';
import { SyncFinalizer } from '../../../model/finalizers/sync-finalizer';
import { container } from '../../../model/container';
import { MockField } from '../../util/mocks/mock-field';
import { Validity } from '../../../model';
import { SyncBaseFinalizerFn } from '../../../model/finalizers/finalizer-functions/sync-base-finalizer-fn.type';

describe('SyncFinalizer', () => {
  test('AccessedFields returns the field names that were accessed by the finalizer.', () => {
    const fieldA = new MockField('', Validity.VALID_FINALIZABLE);
    const fieldB = new MockField('', Validity.VALID_FINALIZABLE);
    const fieldC = new MockField('', Validity.VALID_FINALIZABLE);
    const fields = { fieldA, fieldB, fieldC };

    const baseFinalizerFn: SyncBaseFinalizerFn = ({ fieldA, fieldB }) => {
      return fieldA.value + ' ' + fieldB.value;
    };

    const finalizerFn =
      container.services.FinalizerFnFactory.createSyncFinalizerFn(
        baseFinalizerFn,
      );
    const multiFieldAggregator =
      container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(
        fields,
      );

    const asyncFinalizer = new SyncFinalizer(finalizerFn, multiFieldAggregator);
    asyncFinalizer.accessedFields.onValue(accessedFields => {
      expect(accessedFields.has('fieldA')).toBe(true);
      expect(accessedFields.has('fieldB')).toBe(true);
      expect(accessedFields.has('fieldC')).toBe(false);
    });
  });
});
