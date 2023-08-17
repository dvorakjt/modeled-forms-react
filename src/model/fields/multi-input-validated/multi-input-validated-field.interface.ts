import { AbstractField } from "../base/abstract-field";
import type { MultiInputValidator } from "../../validators/multi-input/multi-input-validator.interface";

export interface MultiInputValidatedField extends AbstractField {
  addValidator(validator : MultiInputValidator) : void;
}
