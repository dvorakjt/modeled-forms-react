import { FieldOrNestedFormTemplate } from './field-or-nested-form-template.type';

export type FormElementTemplateDictionaryOrMap =
  | Record<string, FieldOrNestedFormTemplate>
  | Map<string, FieldOrNestedFormTemplate>;
