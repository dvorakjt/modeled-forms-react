import { Field } from "../fields/field.interface";
import { NestedForm } from "../forms/nested-form.interface";
import { FormElementMap } from "./form-element-map.type";

export interface FormElementRegistry {
  get formElementMap() : FormElementMap;
  registerFormElement(fieldName : string, formElement : NestedForm | Field) : void;
}