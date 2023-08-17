import { Validity } from "../../state/validity.enum";

export class ValidityReducerImpl {
  readonly #errantFields = new Set<string>();
  readonly #invalidFields = new Set<string>();
  readonly #pendingFields = new Set<string>();
  readonly #validUnfinalizableFields = new Set<string>();

  get validity() {
    if (this.#errantFields.size > 0) return Validity.ERROR;
    if (this.#invalidFields.size > 0) return Validity.INVALID;
    if (this.#pendingFields.size > 0) return Validity.PENDING;
    if (this.#validUnfinalizableFields.size > 0)
      return Validity.VALID_UNFINALIZABLE;
    return Validity.VALID_FINALIZABLE;
  }

  updateTallies(elementId : string, validity : Validity) {
    this.updateTally(elementId, validity, Validity.ERROR, this.#errantFields);
    this.updateTally(elementId, validity, Validity.INVALID, this.#invalidFields);
    this.updateTally(elementId, validity, Validity.PENDING, this.#pendingFields);
    this.updateTally(
      elementId,
      validity,
      Validity.VALID_UNFINALIZABLE,
      this.#validUnfinalizableFields
    );
  }

  private updateTally(elementId : string, actualValidity : Validity, expectedValidity : Validity, set : Set<string>) {
    if (actualValidity === expectedValidity)
    set.add(elementId);
    else set.delete(elementId);
  }
}