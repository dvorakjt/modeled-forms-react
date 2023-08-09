import { ParsedBaseFieldTemplate } from "./parsed-base-field-template.interface";

export interface ParsedDualFieldTemplate extends ParsedBaseFieldTemplate {
  primaryDefaultValue : string;
  secondaryDefaultValue : string;
}