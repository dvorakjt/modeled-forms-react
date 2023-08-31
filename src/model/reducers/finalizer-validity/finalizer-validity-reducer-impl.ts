import { FinalizerValidity } from '../../state/finalizer-validity.enum';
import type { FinalizerValidityReducer } from './finalizer-validity-reducer.interface';

export class FinalizerValidityReducerImpl implements FinalizerValidityReducer {
  readonly _errantFinalizers = new Set<string>();
  readonly _fieldErrorFinalizers = new Set<string>();
  readonly _fieldInvalidFinalizers = new Set<string>();
  readonly _fieldPendingFinalizers = new Set<string>();
  readonly _fieldValidUnfinalizableFinalizers = new Set<string>();
  readonly _finalizingFinalizers = new Set<string>();

  get finalizerValidity() {
    if (this._errantFinalizers.size > 0)
      return FinalizerValidity.FINALIZER_ERROR;
    else if (this._fieldErrorFinalizers.size > 0)
      return FinalizerValidity.FIELD_ERROR;
    else if (this._fieldInvalidFinalizers.size > 0)
      return FinalizerValidity.FIELD_INVALID;
    else if (this._fieldPendingFinalizers.size > 0)
      return FinalizerValidity.FIELD_PENDING;
    else if (this._fieldValidUnfinalizableFinalizers.size > 0)
      return FinalizerValidity.FIELD_VALID_UNFINALIZABLE;
    else if (this._finalizingFinalizers.size > 0)
      return FinalizerValidity.VALID_FINALIZING;
    return FinalizerValidity.VALID_FINALIZED;
  }

  updateTallies(
    finalizerName: string,
    finalizerValidity: FinalizerValidity,
  ): void {
    this._updateTally(
      finalizerName,
      finalizerValidity,
      FinalizerValidity.FINALIZER_ERROR,
      this._errantFinalizers,
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      FinalizerValidity.FIELD_ERROR,
      this._fieldErrorFinalizers,
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      FinalizerValidity.FIELD_INVALID,
      this._fieldInvalidFinalizers,
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      FinalizerValidity.FIELD_PENDING,
      this._fieldPendingFinalizers,
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      FinalizerValidity.FIELD_VALID_UNFINALIZABLE,
      this._fieldValidUnfinalizableFinalizers,
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      FinalizerValidity.VALID_FINALIZING,
      this._finalizingFinalizers,
    );
  }

  _updateTally(
    finalizerName: string,
    actualValidity: FinalizerValidity,
    expectedValidity: FinalizerValidity,
    set: Set<string>,
  ) {
    if (actualValidity === expectedValidity) set.add(finalizerName);
    else set.delete(finalizerName);
  }
}
