import type { FieldStateReducer } from '../../types/constituents/reducers/field-state-reducer.interface';
import type { FieldState } from '../../types/constituents/state/field-state.interface';
import { ValidityReducer } from '../../types/constituents/reducers/validity-reducer.interface';

export class FieldStateReducerImpl implements FieldStateReducer {
  #validityReducer : ValidityReducer;
  #omittedFields = new Set<string>();

  constructor(validityReducer : ValidityReducer) {
    this.#validityReducer = validityReducer;
  }

  get validity() {
    return this.#validityReducer.validity;
  }

  get omit() {
    return this.#omittedFields.size > 0;
  }

  updateTallies(fieldName: string, state: FieldState) {
    const { validity, omit } = state;
    this.#validityReducer.updateTallies(fieldName, validity);
    if (omit) this.#omittedFields.add(fieldName);
    else this.#omittedFields.delete(fieldName);
  }

}
