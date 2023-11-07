import { AggregatedStateChanges } from "../../aggregators";
import { AsyncValidator } from "../../validators";

export interface AsyncMultiFieldValidatorTemplate {
  validatorFn: AsyncValidator<AggregatedStateChanges>;
  pendingValidatorMessage?: string;
}