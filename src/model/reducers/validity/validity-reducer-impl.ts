import { Validity } from '../../state/validity.enum';

export class ValidityReducerImpl {
  readonly _errantFields = new Set<string>();
  readonly _invalidFields = new Set<string>();
  readonly _pendingFields = new Set<string>();
  readonly _validUnfinalizableFields = new Set<string>();

  get validity() {
    if (this._errantFields.size > 0) return Validity.ERROR;
    if (this._invalidFields.size > 0) return Validity.INVALID;
    if (this._pendingFields.size > 0) return Validity.PENDING;
    if (this._validUnfinalizableFields.size > 0)
      return Validity.VALID_UNFINALIZABLE;
    return Validity.VALID_FINALIZABLE;
  }

  updateTallies(elementId: string, validity: Validity) {
    this._updateTally(elementId, validity, Validity.ERROR, this._errantFields);
    this._updateTally(
      elementId,
      validity,
      Validity.INVALID,
      this._invalidFields,
    );
    this._updateTally(
      elementId,
      validity,
      Validity.PENDING,
      this._pendingFields,
    );
    this._updateTally(
      elementId,
      validity,
      Validity.VALID_UNFINALIZABLE,
      this._validUnfinalizableFields,
    );
  }

  _updateTally(
    elementId: string,
    actualValidity: Validity,
    expectedValidity: Validity,
    set: Set<string>,
  ) {
    if (actualValidity === expectedValidity) set.add(elementId);
    else set.delete(elementId);
  }
}
