import type { FieldTemplateVariations } from '../fields/field-template-variations.type';
import type { NestedFormTemplate } from '../forms/nested-form-template.interface';

export type FieldOrNestedFormTemplate =
  | FieldTemplateVariations
  | NestedFormTemplate;
