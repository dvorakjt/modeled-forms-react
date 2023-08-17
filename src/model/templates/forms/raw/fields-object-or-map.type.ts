import { FieldTemplateVariations } from '../../fields/raw/field-template-variations.type';
import { NestedFormTemplate } from './nested-form-template.interface';

type FieldOrNestedFormTemplate = FieldTemplateVariations | NestedFormTemplate;

export type FieldsObjectOrMap =
  | {
      [key: string]: FieldOrNestedFormTemplate;
    }
  | Map<string, FieldOrNestedFormTemplate>;
