import { BaseFieldTemplate } from "./base-field-template.type"

export type DualFieldTemplate = BaseFieldTemplate & {
  defaultValue? : undefined;
  primaryDefaultValue : string;
  secondaryDefaultValue : string;
}