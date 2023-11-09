import { Observable } from 'rxjs';
import { AsyncAdapterFn } from '../../adapters/async-adapter-fn.type';
import { SyncAdapterFn } from '../../adapters/sync-adapter-fn.type';
import { AggregatedStateChanges } from '../../aggregators/aggregated-state-changes.interface';
import {
  FinalizerFnFactory,
  FinalizerFnFactoryKey,
  FinalizerFnFactoryKeyType,
} from './finalizer-fn-factory.interface';
import {
  FinalizerValidityTranslator,
  FinalizerValidityTranslatorKey,
} from '../finalizer-validity-translator.interface';
import { FinalizerState } from '../../state/finalizer-state.interface';
import { FinalizerValidity } from '../../state/finalizer-validity.enum';
import { Validity } from '../../state/validity.enum';
import { SyncBaseFinalizerFn } from './sync-base-finalizer-fn.type';
import { AsyncBaseFinalizerFn } from './async-base-finalizer-fn.type';
import { logErrorInDevMode } from '../../util/log-error-in-dev-mode';
import { autowire } from 'undecorated-di';

class FinalizerFnFactoryImpl implements FinalizerFnFactory {
  _finalizerValidityTranslator: FinalizerValidityTranslator;

  constructor(finalizerValidityTranslator: FinalizerValidityTranslator) {
    this._finalizerValidityTranslator = finalizerValidityTranslator;
  }

  createSyncFinalizerFn(
    baseAdapterFn: SyncBaseFinalizerFn,
  ): SyncAdapterFn<FinalizerState> {
    return (aggregatedStateChanges: AggregatedStateChanges) => {
      let value: any;
      let error: any;

      //attempt to create the value first so that fields are accessed and hasOmittedFields, overallValidity
      //can be accessed the first time
      try {
        value = baseAdapterFn(aggregatedStateChanges);
      } catch (e) {
        logErrorInDevMode(e);
        error = e;
      }

      if (aggregatedStateChanges.hasOmittedFields()) {
        return {
          finalizerValidity: FinalizerValidity.VALID_FINALIZED,
          visited: aggregatedStateChanges.visited(),
          modified: aggregatedStateChanges.modified(),
        };
      }
      const overallValidity = aggregatedStateChanges.overallValidity();
      if (overallValidity < Validity.VALID_FINALIZABLE) {
        return {
          finalizerValidity:
            this._finalizerValidityTranslator.translateValidityToFinalizerValidity(
              overallValidity,
            ),
          visited: aggregatedStateChanges.visited(),
          modified: aggregatedStateChanges.modified(),
        };
      }
      if (error) {
        return {
          finalizerValidity: FinalizerValidity.FINALIZER_ERROR,
          visited: aggregatedStateChanges.visited(),
          modified: aggregatedStateChanges.modified(),
        };
      } else {
        return {
          value,
          finalizerValidity: FinalizerValidity.VALID_FINALIZED,
          visited: aggregatedStateChanges.visited(),
          modified: aggregatedStateChanges.modified(),
        };
      }
    };
  }

  createAsyncFinalizerFn(
    baseAdapterFn: AsyncBaseFinalizerFn,
  ): AsyncAdapterFn<FinalizerState> {
    return (aggregatedStateChanges: AggregatedStateChanges) => {
      return new Observable<FinalizerState>(subscriber => {
        try {
          const promise = baseAdapterFn(aggregatedStateChanges);

          if (aggregatedStateChanges.hasOmittedFields()) {
            subscriber.next({
              finalizerValidity: FinalizerValidity.VALID_FINALIZED,
              visited: aggregatedStateChanges.visited(),
              modified: aggregatedStateChanges.modified(),
            });
            subscriber.complete();
          } else if (
            aggregatedStateChanges.overallValidity() <
            Validity.VALID_FINALIZABLE
          ) {
            subscriber.next({
              finalizerValidity:
                this._finalizerValidityTranslator.translateValidityToFinalizerValidity(
                  aggregatedStateChanges.overallValidity(),
                ),
              visited: aggregatedStateChanges.visited(),
              modified: aggregatedStateChanges.modified(),
            });
          } else {
            subscriber.next({
              finalizerValidity: FinalizerValidity.VALID_FINALIZING,
              visited: aggregatedStateChanges.visited(),
              modified: aggregatedStateChanges.modified(),
            });
            promise
              .then(value => {
                subscriber.next({
                  value,
                  finalizerValidity: FinalizerValidity.VALID_FINALIZED,
                  visited: aggregatedStateChanges.visited(),
                  modified: aggregatedStateChanges.modified(),
                });
                subscriber.complete();
              })
              .catch(e => {
                logErrorInDevMode(e);
                subscriber.next({
                  finalizerValidity: FinalizerValidity.FINALIZER_ERROR,
                  visited: aggregatedStateChanges.visited(),
                  modified: aggregatedStateChanges.modified(),
                });
                subscriber.complete();
              });
          }
        } catch (error) {
          logErrorInDevMode(error);
          subscriber.next({
            finalizerValidity: FinalizerValidity.FINALIZER_ERROR,
            visited: aggregatedStateChanges.visited(),
            modified: aggregatedStateChanges.modified(),
          });
          subscriber.complete();
        }
      });
    };
  }
}

const FinalizerFnFactoryService = autowire<
  FinalizerFnFactoryKeyType,
  FinalizerFnFactory,
  FinalizerFnFactoryImpl
>(FinalizerFnFactoryImpl, FinalizerFnFactoryKey, [
  FinalizerValidityTranslatorKey,
]);

export { FinalizerFnFactoryImpl, FinalizerFnFactoryService };
