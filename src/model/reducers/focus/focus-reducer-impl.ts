import { Focused } from "../../state/focused.enum";
import { FocusReducer } from "./focus-reducer.interface";

export class FocusReducerImpl implements FocusReducer {
  _unfocusedFields = new Set<string>();
  _partiallyFocusedFields = new Set<string>();
  _focusedFields = new Set<string>();
  get focused(): Focused {
    if (this._partiallyFocusedFields.size > 0) return Focused.PARTIALLY;
    if (this._unfocusedFields.size > 0) {
      if (this._focusedFields.size > 0) return Focused.PARTIALLY;
      else return Focused.NO;
    }
    return Focused.YES;
  }

  updateTallies(fieldName: string, focused: Focused): void {
    this._updateTally(fieldName, focused, Focused.NO, this._unfocusedFields);
    this._updateTally(
      fieldName,
      focused,
      Focused.PARTIALLY,
      this._partiallyFocusedFields,
    );
    this._updateTally(fieldName, focused, Focused.YES, this._focusedFields);
  }

  _updateTally(
    fieldName: string,
    actualFocused: Focused,
    expectedFocused: Focused,
    set: Set<string>,
  ) {
    if (actualFocused === expectedFocused) set.add(fieldName);
    else set.delete(fieldName);
  }
}
