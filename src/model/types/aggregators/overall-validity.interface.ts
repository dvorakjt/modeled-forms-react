import type { Validity } from '../state/validity.enum';

export interface OverallValidity {
  overallValidity: Validity;
  hasOmittedFields: boolean;
}
