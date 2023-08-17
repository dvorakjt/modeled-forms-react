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
import { SyncBaseFinalizerFunction } from './sync-base-finalizer-fn.type';
import { AsyncBaseFinalizerFn } from './async-base-finalizer-fn.type';
import { logErrorInDevMode } from '../../util/log-error-in-dev-mode';
import { autowire } from 'undecorated-di';

class FinalizerFnFactoryImpl implements FinalizerFnFactory {
  #finalizerValidityTranslator: FinalizerValidityTranslator;

  constructor(finalizerValidityTranslator: FinalizerValidityTranslator) {
    this.#finalizerValidityTranslator = finalizerValidityTranslator;
  }

  createSyncFinalizerFn(
    baseAdapterFn: SyncBaseFinalizerFunction,
  ): SyncAdapterFn<FinalizerState> {
    return (aggregatedStateChanges: AggregatedStateChanges) => {
      if (aggregatedStateChanges.hasOmittedFields) {
        return { finalizerValidity: FinalizerValidity.VALID_FINALIZED };
      }
      if (aggregatedStateChanges.overallValidity < Validity.VALID_FINALIZABLE) {
        return {
          finalizerValidity:
            this.#finalizerValidityTranslator.translateValidityToFinalizerValidity(
              aggregatedStateChanges.overallValidity,
            ),
        };
      }
      try {
        const value = baseAdapterFn(aggregatedStateChanges);
        return {
          value,
          finalizerValidity: FinalizerValidity.VALID_FINALIZED,
        };
      } catch (e) {
        return {
          finalizerValidity: FinalizerValidity.FINALIZER_ERROR,
        };
      }
    };
  }

  createAsyncFinalizerFn(
    baseAdapterFn: AsyncBaseFinalizerFn,
  ): AsyncAdapterFn<FinalizerState> {
    return (aggregatedStateChanges: AggregatedStateChanges) => {
      return new Observable<FinalizerState>(subscriber => {
        if (aggregatedStateChanges.hasOmittedFields) {
          subscriber.next({
            finalizerValidity: FinalizerValidity.VALID_FINALIZED,
          });
          subscriber.complete();
        } else if (
          aggregatedStateChanges.overallValidity < Validity.VALID_FINALIZABLE
        ) {
          subscriber.next({
            finalizerValidity:
              this.#finalizerValidityTranslator.translateValidityToFinalizerValidity(
                aggregatedStateChanges.overallValidity,
              ),
          });
          subscriber.complete();
        } else {
          subscriber.next({
            finalizerValidity: FinalizerValidity.VALID_FINALIZING,
          });
          try {
            const promise = baseAdapterFn(aggregatedStateChanges);
            promise
              .then(value => {
                subscriber.next({
                  value,
                  finalizerValidity: FinalizerValidity.VALID_FINALIZED,
                });
                subscriber.complete();
              })
              .catch(e => {
                logErrorInDevMode(e);
                subscriber.next({
                  finalizerValidity: FinalizerValidity.FINALIZER_ERROR,
                });
                subscriber.complete();
              });
          } catch (e) {
            logErrorInDevMode(e);
            subscriber.next({
              finalizerValidity: FinalizerValidity.FINALIZER_ERROR,
            });
            subscriber.complete();
          }
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
