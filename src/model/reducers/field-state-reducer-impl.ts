import { Validity } from '../types/state/validity.enum';
import type { FieldStateReducer } from '../types/reducers/field-state-reducer.interface';
import type { FieldState } from '../types/state/field-state.interface';

type TallyKey =
  | 'errantFields'
  | 'invalidFields'
  | 'pendingFields'
  | 'validUnfinalizableFields'
  | 'omittedFields';

export class FieldValidityReducerImpl implements FieldStateReducer {
  readonly #tallies = {
    errantFields: new Set<string>(),
    invalidFields: new Set<string>(),
    pendingFields: new Set<string>(),
    validUnfinalizableFields: new Set<string>(),
    omittedFields: new Set<string>(),
  };

  get validity() {
    if (this.#tallies.errantFields.size > 0) return Validity.ERROR;
    if (this.#tallies.invalidFields.size > 0) return Validity.INVALID;
    if (this.#tallies.pendingFields.size > 0) return Validity.PENDING;
    if (this.#tallies.validUnfinalizableFields.size > 0)
      return Validity.VALID_UNFINALIZABLE;
    return Validity.VALID_FINALIZABLE;
  }

  get omit() {
    return this.#tallies.omittedFields.size > 0;
  }

  updateTallies(fieldName: string, state: FieldState) {
    const { validity, omit } = state;
    this.updateTally(fieldName, validity, Validity.ERROR, 'errantFields');
    this.updateTally(fieldName, validity, Validity.INVALID, 'invalidFields');
    this.updateTally(fieldName, validity, Validity.PENDING, 'pendingFields');
    this.updateTally(
      fieldName,
      validity,
      Validity.VALID_UNFINALIZABLE,
      'validUnfinalizableFields',
    );
    if (omit) this.#tallies.omittedFields.add(fieldName);
    else this.#tallies.omittedFields.delete(fieldName);
  }

  updateTally(
    fieldName: string,
    actualValidity: Validity,
    expectedValidity: Validity,
    tallyName:
      | 'errantFields'
      | 'invalidFields'
      | 'pendingFields'
      | 'validUnfinalizableFields',
  ) {
    if (actualValidity === expectedValidity)
      this.#tallies[tallyName].add(fieldName);
    else this.#tallies[tallyName].delete(fieldName);
  }

  clear() {
    for (const key in this.#tallies) {
      this.#tallies[key as TallyKey].clear();
    }
  }
}
