import { Field } from "./field.interface";

export interface DualField extends Field {
  primaryField : Field;
  secondaryField : Field;
  set useSecondaryField(useSecondaryField : boolean);
  get useSecondaryField() : boolean;
}