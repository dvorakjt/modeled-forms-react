import { DualField } from '../../fields/base/dual-field.interface';
import { Field } from '../../fields/base/field.interface';
import { FieldTemplateVariations } from './raw/field-template-variations.type';

interface BaseFieldTemplateParser {
  parseTemplate(template: FieldTemplateVariations): Field | DualField;
}
const BaseFieldTemplateParserKey = 'BaseFieldTemplateParser';
type BaseFieldTemplateParserKeyType = typeof BaseFieldTemplateParserKey;

export {
  BaseFieldTemplateParserKey,
  type BaseFieldTemplateParser,
  type BaseFieldTemplateParserKeyType,
};
