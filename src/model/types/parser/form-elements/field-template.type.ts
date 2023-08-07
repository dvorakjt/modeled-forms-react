import { BaseFieldTemplate } from "./base-field-template.type";

export type FieldTemplate = BaseFieldTemplate & {
  defaultValue : string,
  primaryDefaultValue? : undefined,
  secondaryDefaultValue? : undefined
}