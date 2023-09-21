import { AggregatedStateChanges } from '../../aggregators/aggregated-state-changes.interface';
import { AsyncValidator } from '../../validators/async-validator.type';
import { SyncValidator } from '../../validators/sync-validator.type';

export interface MultiFieldValidatorsTemplate {
  sync?: Array<SyncValidator<AggregatedStateChanges>>;
  async?: Array<{
    validatorFn: AsyncValidator<AggregatedStateChanges>;
    pendingValidatorMessage?: string;
  }>;
}
