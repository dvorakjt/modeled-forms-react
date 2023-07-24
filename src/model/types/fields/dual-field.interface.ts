import { SimpleField } from "../../fields/simple-field";
import { Field } from "./field.interface";

export interface DualField extends Field {
  primaryField : SimpleField;
  secondaryField : SimpleField;
  set useSecondaryField(useSecondaryField : boolean);
  get useSecondaryField() : boolean;
}