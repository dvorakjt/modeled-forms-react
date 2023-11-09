import { Visited } from '../../state/visited.enum';

export interface VisitationReducer {
  visited: Visited;
  updateTallies(fieldName: string, visited: Visited): void;
}
