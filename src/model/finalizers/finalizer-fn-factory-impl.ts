
import { Observable } from "rxjs";
import { AsyncAdapterFn } from "../types/adapters/async-adapter-fn.type";
import { SyncAdapterFn } from "../types/adapters/sync-adapter-fn.type";
import { AggregatedStateChanges } from "../types/aggregators/aggregated-state-changes.interface";
import { FinalizerFnFactory } from "../types/finalizers/finalizer-fn-factory.interface";
import { FinalizerValidityTranslator } from "../types/finalizers/finalizer-validity-to-validity-translator.interface";
import { FormElementMap } from "../types/form-elements/form-element-map.type";
import { FinalizerState } from "../types/state/finalizer-state.interface";
import { FinalizerValidity } from "../types/state/finalizer-validity.enum";
import { Validity } from "../types/state/validity.enum";
import { SyncBaseFinalizerFunction } from "../types/finalizers/sync-base-finalizer-fn.type";
import { AsyncBaseFinalizerFn } from "../types/finalizers/async-base-finalizer-fn.type";
import { logErrorInDevMode } from "../util/log-error-in-dev-mode";

export class FinalizerFnFactoryImpl implements FinalizerFnFactory {
  #finalizerValidityTranslator : FinalizerValidityTranslator;

  constructor(
    finalizerValidityTranslator : FinalizerValidityTranslator
  ) {
    this.#finalizerValidityTranslator = finalizerValidityTranslator;
  }

  createSyncFinalizerFn<Fields extends FormElementMap>(baseAdapterFn: SyncBaseFinalizerFunction<Fields>): SyncAdapterFn<Fields, FinalizerState> {
    return ((aggregatedStateChanges : AggregatedStateChanges<Fields>) => {
      if(aggregatedStateChanges.hasOmittedFields) {
        return { finalizerValidity : FinalizerValidity.VALID_FINALIZED }
      }
      if(aggregatedStateChanges.overallValidity < Validity.VALID_FINALIZABLE) {
        return {
          finalizerValidity : this.#finalizerValidityTranslator.translateValidityToFinalizerValidity(aggregatedStateChanges.overallValidity)
        }
      };
      try {
        const value = baseAdapterFn(aggregatedStateChanges);
        return {
          value,
          finalizerValidity : FinalizerValidity.VALID_FINALIZED
        }
      } catch (e) {
        return {
          finalizerValidity : FinalizerValidity.FINALIZER_ERROR
        }
      }
    });
  }

  createAsyncFinalizerFn<Fields extends FormElementMap>(baseAdapterFn: AsyncBaseFinalizerFn<Fields>): AsyncAdapterFn<Fields, FinalizerState> {
    return ((aggregatedStateChanges : AggregatedStateChanges<Fields>) => {
      return new Observable<FinalizerState>((subscriber) => {
        if(aggregatedStateChanges.hasOmittedFields) {
          subscriber.next({
            finalizerValidity : FinalizerValidity.VALID_FINALIZED
          });
          subscriber.complete();
        }
        else if(aggregatedStateChanges.overallValidity < Validity.VALID_FINALIZABLE) {
          subscriber.next({
            finalizerValidity : this.#finalizerValidityTranslator.translateValidityToFinalizerValidity(aggregatedStateChanges.overallValidity)
          });
          subscriber.complete();
        }
        else {
          subscriber.next({
            finalizerValidity : FinalizerValidity.VALID_FINALIZING
          });
          try {
            const promise = baseAdapterFn(aggregatedStateChanges);
            promise.then((value) => {
              subscriber.next({
                value,
                finalizerValidity : FinalizerValidity.VALID_FINALIZED
              });
              subscriber.complete();
            }).catch((e) => {
              logErrorInDevMode(e);
              subscriber.next({
                finalizerValidity : FinalizerValidity.FINALIZER_ERROR
              });
              subscriber.complete();
            });
          } catch(e) {
            logErrorInDevMode(e);
            subscriber.next({
              finalizerValidity : FinalizerValidity.FINALIZER_ERROR
            });
            subscriber.complete();
          }
        }
      });
    });
  }
}