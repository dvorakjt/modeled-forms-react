import { NestedForm } from "../constituents/forms/nested-form.interface";
import { RootForm } from "../constituents/forms/root-form.interface";
import { FieldTemplateVariations } from "./form-elements/field-template-variations.type";

export type CreateRootFormFromTemplate = <K extends string>(template : {
  fields : {
    [P in K] : FieldTemplateVariations<K> | NestedForm
  }
}) => RootForm;