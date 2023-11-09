import { Modified } from "../../state/modified.enum";

export interface ModificationReducer {
  modified : Modified;
  updateTallies(fieldName : string, modified: Modified) : void;
}