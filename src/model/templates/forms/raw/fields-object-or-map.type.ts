<<<<<<< HEAD
import { FieldTemplateVariations } from "../../fields/field-template-variations.type"
import { NestedFormTemplate } from "./nested-form-template.interface"
=======
import { FieldTemplateVariations } from '../../fields/raw/field-template-variations.type';
import { NestedFormTemplate } from './nested-form-template.interface';
>>>>>>> origin/main

type FieldOrNestedFormTemplate = FieldTemplateVariations | NestedFormTemplate;

export type FieldsObjectOrMap =
  | {
      [key: string]: FieldOrNestedFormTemplate;
    }
  | Map<string, FieldOrNestedFormTemplate>;
