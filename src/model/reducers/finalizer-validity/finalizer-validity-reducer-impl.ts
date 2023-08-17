import { FinalizerValidity } from "../../state/finalizer-validity.enum";
import type { FinalizerValidityReducer } from "./finalizer-validity-reducer.interface";

export class FinalizerValidityReducerImpl implements FinalizerValidityReducer {
  readonly #errantFinalizers = new Set<string>();
  readonly #fieldErrorFinalizers = new Set<string>();
  readonly #fieldInvalidFinalizers = new Set<string>();
  readonly #fieldPendingFinalizers = new Set<string>();
  readonly #fieldValidUnfinalizableFinalizers = new Set<string>();
  readonly #finalizingFinalizers = new Set<string>();

  get finalizerValidity() {
    if(this.#errantFinalizers.size > 0) return FinalizerValidity.FINALIZER_ERROR;
    else if(this.#fieldErrorFinalizers.size > 0) return FinalizerValidity.FIELD_ERROR;
    else if(this.#fieldInvalidFinalizers.size > 0) return FinalizerValidity.FIELD_INVALID;
    else if(this.#fieldPendingFinalizers.size > 0) return FinalizerValidity.FIELD_PENDING;
    else if(this.#fieldValidUnfinalizableFinalizers.size > 0) return FinalizerValidity.FIELD_VALID_UNFINALIZABLE;
    else if(this.#finalizingFinalizers.size > 0) return FinalizerValidity.VALID_FINALIZING;
    return FinalizerValidity.VALID_FINALIZED;
  }

  updateTallies(finalizerName: string, finalizerValidity: FinalizerValidity): void {
    this.updateTally(finalizerName, finalizerValidity, FinalizerValidity.FINALIZER_ERROR, this.#errantFinalizers);
    this.updateTally(finalizerName, finalizerValidity, FinalizerValidity.FIELD_ERROR, this.#fieldErrorFinalizers);
    this.updateTally(finalizerName, finalizerValidity, FinalizerValidity.FIELD_INVALID, this.#fieldInvalidFinalizers);
    this.updateTally(finalizerName, finalizerValidity, FinalizerValidity.FIELD_PENDING, this.#fieldPendingFinalizers);
    this.updateTally(finalizerName, finalizerValidity, FinalizerValidity.FIELD_VALID_UNFINALIZABLE, this.#fieldValidUnfinalizableFinalizers);
    this.updateTally(finalizerName, finalizerValidity, FinalizerValidity.VALID_FINALIZING, this.#finalizingFinalizers);
  }

  private updateTally(finalizerName : string, actualValidity : FinalizerValidity, expectedValidity : FinalizerValidity, set : Set<string>) {
    if(actualValidity === expectedValidity) set.add(finalizerName);
    else set.delete(finalizerName);
  }
}