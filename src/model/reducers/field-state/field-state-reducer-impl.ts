import type { FieldStateReducer } from './field-state-reducer.interface';
import type { FieldState } from '../../state/field-state.interface';
import { ValidityReducer } from '../validity/validity-reducer.interface';
import { VisitationReducer } from '../visitation/visitation-reducer.interface';
import { ModificationReducer } from '../modification/modification-reducer.interface';
import { FocusReducer } from '../focus/focus-reducer.interface';

export class FieldStateReducerImpl implements FieldStateReducer {
  _validityReducer: ValidityReducer;
  _visitationReducer: VisitationReducer;
  _modificationReducer: ModificationReducer;
  _focusReducer : FocusReducer;
  _omittedFields = new Set<string>();

  constructor(
    validityReducer: ValidityReducer,
    visitationReducer: VisitationReducer,
    modificationReducer: ModificationReducer,
    focusReducer : FocusReducer
  ) {
    this._validityReducer = validityReducer;
    this._visitationReducer = visitationReducer;
    this._modificationReducer = modificationReducer;
    this._focusReducer = focusReducer;
  }

  get validity() {
    return this._validityReducer.validity;
  }

  get omit() {
    return this._omittedFields.size > 0;
  }

  get visited() {
    return this._visitationReducer.visited;
  }

  get modified() {
    return this._modificationReducer.modified;
  }

  get focused() {
    return this._focusReducer.focused;
  }

  updateTallies(fieldName: string, state: FieldState) {
    const { validity, omit, visited, modified } = state;
    this._validityReducer.updateTallies(fieldName, validity);
    this._visitationReducer.updateTallies(fieldName, visited);
    this._modificationReducer.updateTallies(fieldName, modified);
    if (omit) this._omittedFields.add(fieldName);
    else this._omittedFields.delete(fieldName);
  }
}
