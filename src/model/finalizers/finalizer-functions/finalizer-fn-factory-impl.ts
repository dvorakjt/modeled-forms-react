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
  #finalizerValidityTranslator: FinalizerValidityTranslator;

  constructor(finalizerValidityTranslator: FinalizerValidityTranslator) {
    this.#finalizerValidityTranslator = finalizerValidityTranslator;
  }

  createSyncFinalizerFn(
    baseAdapterFn: SyncBaseFinalizerFn,
  ): SyncAdapterFn<FinalizerState> {

    return (aggregatedStateChanges: AggregatedStateChanges) => {
      let value : any;
      let error : any;

      //attempt to create the value first so that fields are accessed and hasOmittedFields, overallValidity
      //can be accessed the first time
      try {
        value = baseAdapterFn(aggregatedStateChanges);
      } catch (e) {
        logErrorInDevMode(e);
        error = e;
      } 
      
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

      if(error) {
        return {
          finalizerValidity : FinalizerValidity.FINALIZER_ERROR
        }
      }
      else {
        return {
          value,
          finalizerValidity : FinalizerValidity.VALID_FINALIZED
        }
      }
    };
  }

  createAsyncFinalizerFn(
    baseAdapterFn: AsyncBaseFinalizerFn,
  ): AsyncAdapterFn<FinalizerState> {
    return (aggregatedStateChanges: AggregatedStateChanges) => {
      return new Observable<FinalizerState>(subscriber => {
        //first attempt to create the promise so that hasOmittedFields and overallValidity can be accessed the first time
        let promise : Promise<any> | undefined = undefined;
        let error : any;

        try {
          promise = baseAdapterFn(aggregatedStateChanges);
        } catch (e) {
          error = e;
        }

        if(error) {
          logErrorInDevMode(error);
          subscriber.next({
            finalizerValidity : FinalizerValidity.FINALIZER_ERROR
          });
          subscriber.complete();
        } else if(aggregatedStateChanges.hasOmittedFields) {
          subscriber.next({
            finalizerValidity : FinalizerValidity.VALID_FINALIZED
          });
          subscriber.complete();
        } else if(aggregatedStateChanges.overallValidity < Validity.VALID_FINALIZABLE) {
          subscriber.next({
            finalizerValidity: this.#finalizerValidityTranslator.translateValidityToFinalizerValidity(
              aggregatedStateChanges.overallValidity,
            ),
          });
        } else if(promise) {
          subscriber.next({
            finalizerValidity: FinalizerValidity.VALID_FINALIZING,
          });
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
        } else {
          throw new Error('Async finalizer function did not return a promise.');
        }
      });
    };
  }
}

const FinalizerFnFactoryService = autowire<
  FinalizerFnFactoryKeyType,
  FinalizerFnFactory,
  FinalizerFnFactoryImpl
>(FinalizerFnFactoryImpl, FinalizerFnFactoryKey, 
[
  FinalizerValidityTranslatorKey,
]);

export { FinalizerFnFactoryImpl, FinalizerFnFactoryService };
