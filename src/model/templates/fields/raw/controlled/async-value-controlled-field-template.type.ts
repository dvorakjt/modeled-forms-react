import { AsyncFieldValueControlFn } from '../../../../fields/controlled/control-functions/fields/async-field-value-control-fn.type';
import { FieldTemplate } from '../base/field-template.type';

export type AsyncValueControlledFieldTemplate = FieldTemplate & {
  asyncValueControlFn: AsyncFieldValueControlFn;
  syncValueControlFn?: undefined;
  asyncStateControlFn?: undefined;
  syncStateControlFn?: undefined;
};
