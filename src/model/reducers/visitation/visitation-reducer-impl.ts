import { Visited } from '../../state/visited.enum';
import { VisitationReducer } from './visitation-reducer.interface';

export class VisitationReducerImpl implements VisitationReducer {
  _unvisitedFields = new Set<string>();
  _partiallyVisitedFields = new Set<string>();
  _visitedFields = new Set<string>();
  get visited(): Visited {
    if (this._partiallyVisitedFields.size > 0) return Visited.PARTIALLY;
    if (this._unvisitedFields.size > 0) {
      if (this._visitedFields.size > 0) return Visited.PARTIALLY;
      else return Visited.NO;
    }
    return Visited.YES;
  }

  updateTallies(fieldName: string, visited: Visited): void {
    this._updateTally(fieldName, visited, Visited.NO, this._unvisitedFields);
    this._updateTally(
      fieldName,
      visited,
      Visited.PARTIALLY,
      this._partiallyVisitedFields,
    );
    this._updateTally(fieldName, visited, Visited.YES, this._visitedFields);
  }

  _updateTally(
    fieldName: string,
    actualVisited: Visited,
    expectedVisited: Visited,
    set: Set<string>,
  ) {
    if (actualVisited === expectedVisited) set.add(fieldName);
    else set.delete(fieldName);
  }
}
