import { Modified } from '../../state/modified.enum';
import { ModificationReducer } from './modification-reducer.interface';

export class ModificationReducerImpl implements ModificationReducer {
  _unmodifiedFields = new Set<string>();
  _partiallyModifiedFields = new Set<string>();
  _modifiedFields = new Set<string>();
  get modified(): Modified {
    if (this._partiallyModifiedFields.size > 0) return Modified.PARTIALLY;
    if (this._unmodifiedFields.size > 0) {
      if (this._modifiedFields.size > 0) return Modified.PARTIALLY;
      else return Modified.NO;
    }
    return Modified.YES;
  }

  updateTallies(fieldName: string, modified: Modified): void {
    this._updateTally(fieldName, modified, Modified.NO, this._unmodifiedFields);
    this._updateTally(
      fieldName,
      modified,
      Modified.PARTIALLY,
      this._partiallyModifiedFields,
    );
    this._updateTally(fieldName, modified, Modified.YES, this._modifiedFields);
  }

  _updateTally(
    fieldName: string,
    actualModified: Modified,
    expectedModified: Modified,
    set: Set<string>,
  ) {
    if (actualModified === expectedModified) set.add(fieldName);
    else set.delete(fieldName);
  }
}
