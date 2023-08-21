import { AsyncFieldStateControlFn } from '../../../fields/controlled/control-functions/fields/async-field-state-control-fn.type';
import { FieldTemplate } from '../base/field-template.type';

export type AsyncStateControlledFieldTemplate = FieldTemplate & {
  asyncStateControlFn: AsyncFieldStateControlFn;
  syncStateControlFn?: undefined;
  asyncValueControlFn?: undefined;
  syncValueControlFn: undefined;
};
