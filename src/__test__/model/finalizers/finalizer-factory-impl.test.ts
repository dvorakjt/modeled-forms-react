import { describe, test, expect, beforeEach } from 'vitest';
import { FinalizerFactoryImpl } from '../../../model/finalizers/finalizer-factory-impl';
import { container } from '../../../model/container';
import { FinalizerFactory } from '../../../model/finalizers/finalizer-factory.interface';
import { SyncFinalizerFn } from '../../../model/finalizers/finalizer-functions/sync-finalizer-fn.type';
import { Validity } from '../../../model';
import { FinalizerValidity } from '../../../model/state/finalizer-validity.enum';
import { MockField } from '../../util/mocks/mock-field';
import { SyncFinalizer } from '../../../model/finalizers/sync-finalizer';
import { AsyncFinalizerFn } from '../../../model/finalizers/finalizer-functions/async-finalizer-fn.type';
import { Observable } from 'rxjs';
import { AsyncFinalizer } from '../../../model/finalizers/async-finalizer';
import { DefaultFinalizer } from '../../../model/finalizers/default-finalizer';

describe('FinalizerFactoryImpl', () => {
  let finalizerFactory: FinalizerFactory;

  beforeEach(() => {
    finalizerFactory = new FinalizerFactoryImpl(
      container.services.AggregatorFactory,
      container.services.FinalizerValidityTranslator,
    );
  });

  test('createSyncFinalizer() returns a SyncFinalizer when called.', () => {
    const syncFinalizerFn: SyncFinalizerFn = ({ fieldA }) => ({
      value:
        fieldA.validity === Validity.VALID_FINALIZABLE
          ? fieldA.value.toUpperCase()
          : undefined,
      finalizerValidity:
        fieldA.validity === Validity.VALID_FINALIZABLE
          ? FinalizerValidity.VALID_FINALIZED
          : FinalizerValidity.FIELD_INVALID,
      modified: fieldA.modified,
      visited: fieldA.visited,
      focused: fieldA.focused
    });
    const fieldA = new MockField('', Validity.VALID_FINALIZABLE);
    const fields = { fieldA };
    const finalizer = finalizerFactory.createSyncFinalizer(
      syncFinalizerFn,
      fields,
    );
    expect(finalizer).toBeInstanceOf(SyncFinalizer);
  });

  test('createAsyncFinalizer() returns an AsyncFinalizer when called.', () => {
    const asyncFinalizerFn: AsyncFinalizerFn = ({ fieldA }) => {
      return new Observable(subscriber => {
        subscriber.next({
          finalizerValidity: FinalizerValidity.VALID_FINALIZING,
          visited: fieldA.visited,
          modified: fieldA.modified,
          focused: fieldA.focused
        });
        setTimeout(() => {
          subscriber.next({
            value: fieldA.value.toUpperCase(),
            finalizerValidity: FinalizerValidity.VALID_FINALIZED,
            visited: fieldA.visited,
            modified: fieldA.modified,
            focused: fieldA.focused
          });
          subscriber.complete();
        }, 500);
      });
    };
    const fieldA = new MockField('', Validity.VALID_FINALIZABLE);
    const fields = { fieldA };
    const finalizer = finalizerFactory.createAsyncFinalizer(
      asyncFinalizerFn,
      fields,
    );
    expect(finalizer).toBeInstanceOf(AsyncFinalizer);
  });

  test('createDefaultFinalizer() returns a DefaultFinalizer when called.', () => {
    const fieldA = new MockField('', Validity.VALID_FINALIZABLE);
    const finalizer = finalizerFactory.createDefaultFinalizer(fieldA);
    expect(finalizer).toBeInstanceOf(DefaultFinalizer);
  });
});
