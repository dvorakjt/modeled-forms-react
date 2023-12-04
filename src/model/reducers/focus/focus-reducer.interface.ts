import { Focused } from '../../state/focused.enum';

export interface FocusReducer {
  focused : Focused;
  updateTallies(fieldName: string, focused : Focused): void;
}
