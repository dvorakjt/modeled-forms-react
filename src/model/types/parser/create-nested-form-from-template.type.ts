import { NestedForm } from "../constituents/forms/nested-form.interface";
import { FieldTemplateVariations } from "./form-elements/field-template-variations.type";

export type CreateNestedFormFromTemplate = <K extends string>(template : {
  fields : {
    [P in K] : FieldTemplateVariations<K> | NestedForm
  }
}) => NestedForm;