import { AbstractMultiInputValidatedField } from "./abstract-multi-input-validated-field";
import { AbstractField } from "../base/abstract-field";
import { FinalizerFacingMultiInputValidatorReducer } from "../../reducers/multi-input-validator-validity/finalizer-facing-multi-input-validator-reducer";

export class FinalizerFacingMultiInputValidatedField extends AbstractMultiInputValidatedField {
  constructor(baseField : AbstractField, finalizerFacingMultiInputValidityReducer : FinalizerFacingMultiInputValidatorReducer) {
    super(baseField, finalizerFacingMultiInputValidityReducer);
  }
}
