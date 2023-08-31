import type { FieldStateReducer } from './field-state-reducer.interface';
import type { FieldState } from '../../state/field-state.interface';
import { ValidityReducer } from '../validity/validity-reducer.interface';

export class FieldStateReducerImpl implements FieldStateReducer {
  _validityReducer: ValidityReducer;
  _omittedFields = new Set<string>();

  constructor(validityReducer: ValidityReducer) {
    this._validityReducer = validityReducer;
  }

  get validity() {
    return this._validityReducer.validity;
  }

  get omit() {
    return this._omittedFields.size > 0;
  }

  updateTallies(fieldName: string, state: FieldState) {
    const { validity, omit } = state;
    this._validityReducer.updateTallies(fieldName, validity);
    if (omit) this._omittedFields.add(fieldName);
    else this._omittedFields.delete(fieldName);
  }
}
