import type { Field } from "../base/field.interface";
import type { MultiInputValidator } from "../../validators/multi-input/multi-input-validator.interface";

export interface MultiInputValidatedField extends Field {
  addValidator(validator : MultiInputValidator) : void;
}