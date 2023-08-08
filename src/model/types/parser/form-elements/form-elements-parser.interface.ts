import { FormElementMap } from "../../constituents/form-elements/form-element-map.type";
import { NestedForm } from "../../constituents/forms/nested-form.interface";
import { FieldTemplateVariations } from "./field-template-variations.type";

export interface FormElementsParser {
  parseTemplate<K extends string>(fields : {
    [P in K] : FieldTemplateVariations<K> | NestedForm
  }) : FormElementMap;
}