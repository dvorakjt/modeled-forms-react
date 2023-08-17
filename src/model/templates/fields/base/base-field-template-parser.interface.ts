import { AbstractField } from "../../../fields/base/abstract-field";
import { AbstractDualField } from "../../../fields/base/abstract-dual-field";
import { FieldTemplateVariations } from "../field-template-variations.type";

export interface BaseFieldTemplateParser {
  parseTemplate(template : FieldTemplateVariations) : AbstractField | AbstractDualField;
}

export const BaseFieldTemplateParserKey = 'BaseFieldTemplateParser';
export type BaseFieldTemplateParserKeyType = typeof BaseFieldTemplateParserKey;