import { Field } from "../fields/field.interface";
import { NestedForm } from "../forms/nested-form.interface"

export type FormElementMap = { 
  [key :string] : NestedForm | Field;
}