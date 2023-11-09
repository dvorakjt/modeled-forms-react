import { AggregatedStateChanges } from '../../aggregators/aggregated-state-changes.interface';
import { SyncValidator } from '../../validators/sync-validator.type';
import { AsyncMultiFieldValidatorTemplate } from './async-multi-field-validator-template.interface';

export interface MultiFieldValidatorsTemplate {
  sync?: Array<SyncValidator<AggregatedStateChanges>>;
  async?: Array<AsyncMultiFieldValidatorTemplate>;
}
