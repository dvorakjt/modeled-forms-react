import { describe, test, expect, beforeEach, vi } from 'vitest';
import { FinalizerFnFactoryImpl } from '../../../../model/finalizers/finalizer-functions/finalizer-fn-factory-impl';
import { container } from '../../../../model/container';
import { FinalizerFnFactory } from '../../../../model/finalizers/finalizer-functions/finalizer-fn-factory.interface';
import { SyncBaseFinalizerFn } from '../../../../model/finalizers/finalizer-functions/sync-base-finalizer-fn.type';
import { FinalizerValidity } from '../../../../model/state/finalizer-validity.enum';
import { Visited } from '../../../../model/state/visited.enum';
import { Modified } from '../../../../model/state/modified-enum';
import { MockField } from '../../../util/mocks/mock-field';
import { Validity } from '../../../../model';
import { AsyncBaseFinalizerFn } from '../../../../model/finalizers/finalizer-functions/async-base-finalizer-fn.type';
import { Observable, Subject } from 'rxjs';
import { FinalizerState } from '../../../../model/state/finalizer-state.interface';
import { setNodeEnv } from '../../../util/funcs/set-node-env';

describe('FinalizerFnFactoryImpl', () => {
  let finalizerFnFactory : FinalizerFnFactory;
  
  beforeEach(() => {
    finalizerFnFactory = new FinalizerFnFactoryImpl(
      container.services.FinalizerValidityTranslator
    );
  });
  
  test('createSyncFinalizerFn() returns a function that returns the expected FinalizerState if the aggregatedStateChanges object passed into the base function has omitted fields.', () => {
    const fields = {
      fieldA : container.services.BaseFieldFactory.createField('', true, [], []),
    }

    const aggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    const baseFinalizerFn : SyncBaseFinalizerFn = ({ fieldA }) => fieldA.value;

    aggregator.aggregateChanges.subscribe(aggregateChange => {
      const finalizerFn = finalizerFnFactory.createSyncFinalizerFn(baseFinalizerFn);
      expect(finalizerFn(aggregateChange)).toStrictEqual({
        finalizerValidity: FinalizerValidity.VALID_FINALIZED,
        visited : Visited.NO,
        modified : Modified.NO
      });
    });
  });

  test('createSyncFinalizerFn() returns a function that returns the expected FinalizerState if the aggregatedStateChanges object passed into the base function has an overallValidity that is less than VALID_FINALIZABLE.', () => {
    const fields = {
      fieldA : new MockField('', Validity.INVALID)
    }

    const aggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    const baseFinalizerFn : SyncBaseFinalizerFn = ({ fieldA }) => fieldA.value;

    aggregator.aggregateChanges.subscribe(aggregateChange => {
      const finalizerFn = finalizerFnFactory.createSyncFinalizerFn(baseFinalizerFn);
      expect(finalizerFn(aggregateChange)).toStrictEqual({
        finalizerValidity: FinalizerValidity.FIELD_INVALID,
        visited : Visited.NO,
        modified : Modified.NO
      });
    });
  });

  test('createSyncFinalizerFn() returns a function that returns the expected FinalizerState if the base finalizer function throws an error.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }

    const aggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseFinalizerFn : SyncBaseFinalizerFn = ({ fieldA }) => {
      throw new Error('error finalizing fields.');
    }

    aggregator.aggregateChanges.subscribe(aggregateChange => {
      const finalizerFn = finalizerFnFactory.createSyncFinalizerFn(baseFinalizerFn);
      expect(finalizerFn(aggregateChange)).toStrictEqual({
        finalizerValidity: FinalizerValidity.FINALIZER_ERROR,
        visited : Visited.NO,
        modified : Modified.NO
      });
    });
  });

  test('createSyncFinalizerFn() returns a function that returns the expected FinalizerState if there are no omitted fields, the base finalizer fn does not throw an error, and if the overallValidity is VALID_FINALIZABLE.', () => {
    const fields = {
      fieldA : container.services.BaseFieldFactory.createField('test', false, [], [])
    }

    const aggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    const baseFinalizerFn : SyncBaseFinalizerFn = ({ fieldA }) => fieldA.value;

    aggregator.aggregateChanges.subscribe(aggregateChange => {
      const finalizerFn = finalizerFnFactory.createSyncFinalizerFn(baseFinalizerFn);
      expect(finalizerFn(aggregateChange)).toStrictEqual({
        value : fields.fieldA.state.value,
        finalizerValidity: FinalizerValidity.VALID_FINALIZED,
        visited : Visited.NO,
        modified : Modified.YES
      });
    });
  });

  test('createAsyncFinalizerFn() returns a function that returns an observable which emits the expected FinalizerState if an error is thrown before the promise is created.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }

    const aggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseFinalizerFn : AsyncBaseFinalizerFn = ({ fieldA }) => {
      throw new Error('Error creating promise.');
    }

    aggregator.aggregateChanges.subscribe(aggregateChange => {
      const finalizerFn = finalizerFnFactory.createAsyncFinalizerFn(baseFinalizerFn);
      const observable = finalizerFn(aggregateChange) as Observable<FinalizerState>;
      observable.subscribe(finalizerState => {
        expect(finalizerState).toStrictEqual({
          finalizerValidity : FinalizerValidity.FINALIZER_ERROR,
          visited : Visited.NO,
          modified : Modified.NO
        });
      })      
    });
  });

  test('createAsyncFinalizerFn() returns a function which calls logErrorInDevMode() if an error is thrown before the promise is created.', () => {
    const fields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }

    const aggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    const expectedError = new Error('Error creating promise.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseFinalizerFn : AsyncBaseFinalizerFn = ({ fieldA }) => {
      throw expectedError;
    }

    const resetProcessDotEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error: vi.fn(),
    });

    aggregator.aggregateChanges.subscribe(aggregateChange => {
      const finalizerFn = finalizerFnFactory.createAsyncFinalizerFn(baseFinalizerFn);
      const observable = finalizerFn(aggregateChange) as Observable<FinalizerState>;
      observable.subscribe(() => {
        expect(console.error).toHaveBeenCalledWith(expectedError);
        resetProcessDotEnv();
        vi.unstubAllGlobals();
      })      
    });
  });

  test('createAsyncFinalizerFn() returns a function that returns an observable which emits the expected FinalizerState if there are omitted fields.', () => {
    const fields = {
      fieldA : container.services.BaseFieldFactory.createField('', true, [], [])
    }

    const aggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    const baseFinalizerFn : AsyncBaseFinalizerFn = ({ fieldA }) => {
      return new Promise((resolve) => {
        resolve(fieldA.value);
      });
    }

    aggregator.aggregateChanges.subscribe(aggregateChange => {
      const finalizerFn = finalizerFnFactory.createAsyncFinalizerFn(baseFinalizerFn);
      const observable = finalizerFn(aggregateChange) as Observable<FinalizerState>;
      observable.subscribe(finalizerState => {
        expect(finalizerState).toStrictEqual({
          finalizerValidity : FinalizerValidity.VALID_FINALIZED,
          visited : Visited.NO,
          modified : Modified.NO
        });
      })      
    });
  });

  test('createAsyncFinalizerFn() returns a function that returns an observable which emits the expected FinalizerState if overallValidity() is less than VALID_FINALIZABLE.', () => {
    const fields = {
      fieldA : new MockField('', Validity.INVALID)
    }

    const aggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    const baseFinalizerFn : AsyncBaseFinalizerFn = ({ fieldA }) => {
      return new Promise((resolve) => {
        resolve(fieldA.value);
      });
    }

    aggregator.aggregateChanges.subscribe(aggregateChange => {
      const finalizerFn = finalizerFnFactory.createAsyncFinalizerFn(baseFinalizerFn);
      const observable = finalizerFn(aggregateChange) as Observable<FinalizerState>;
      observable.subscribe(finalizerState => {
        expect(finalizerState).toStrictEqual({
          finalizerValidity : FinalizerValidity.FIELD_INVALID,
          visited : Visited.NO,
          modified : Modified.NO
        });
      })      
    });
  });

  test('createAsyncFinalizerFn() returns a function that returns an observable which emits the expected FinalizerState if all fields are VALID_FINALIZABLE and none are omitted.', () => {
    const fields = {
      fieldA : container.services.BaseFieldFactory.createField('test', false, [], [])
    }

    const aggregator = container.services.AggregatorFactory.createMultiFieldAggregatorFromFields(fields);

    const trigger = new Subject<void>();

    const baseFinalizerFn : AsyncBaseFinalizerFn = ({ fieldA }) => {
      return new Promise((resolve) => {
        trigger.subscribe({
          complete : () => resolve(fieldA.value)
        });
      });
    }

    let pass = 0;

    aggregator.aggregateChanges.subscribe(aggregateChange => {
      const finalizerFn = finalizerFnFactory.createAsyncFinalizerFn(baseFinalizerFn);
      const observable = finalizerFn(aggregateChange) as Observable<FinalizerState>;
      observable.subscribe(finalizerState => {
        if(pass++ === 0) {
          expect(finalizerState).toStrictEqual({
            finalizerValidity : FinalizerValidity.VALID_FINALIZING,
            visited : Visited.NO,
            modified : Modified.YES
          });
        } else {
          expect(finalizerState).toStrictEqual({
            value: 'test',
            finalizerValidity : FinalizerValidity.VALID_FINALIZED,
            visited : Visited.NO,
            modified : Modified.YES
          })
        }
      })      
    });

    trigger.complete();
  });
});