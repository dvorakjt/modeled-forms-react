import { SyncFieldStateControlFn } from '../../../fields/controlled/control-functions/fields/sync-field-state-control-fn.type';
import { FieldTemplate } from '../base/field-template.type';

export type SyncStateControlledFieldTemplate = FieldTemplate & {
  syncStateControlFn: SyncFieldStateControlFn;
  asyncStateControlFn?: undefined;
  syncValueControlFn?: undefined;
  asyncValueControlFn?: undefined;
};
