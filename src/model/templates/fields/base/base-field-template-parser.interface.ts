import { DualField } from "../../fields/base/dual-field.interface";
import { Field } from "../../fields/base/field.interface";
import { FieldTemplateVariations } from "./field-template-variations.type";

export interface BaseFieldTemplateParser {
  parseTemplate(template : FieldTemplateVariations) : Field | DualField;
}

export const BaseFieldTemplateParserKey = 'BaseFieldTemplateParser';
export type BaseFieldTemplateParserKeyType = typeof BaseFieldTemplateParserKey;