import { FormElementDictionary } from '../../form-elements/form-element-dictionary.type';
import { AbstractField } from '../base/abstract-field';
import { AsyncDualFieldStateControlFn } from './control-functions/dual-fields/async-dual-field-state-control-fn.type';
import { AsyncDualFieldValueControlFn } from './control-functions/dual-fields/async-dual-field-value-control-fn.type';
import { SyncDualFieldStateControlFn } from './control-functions/dual-fields/sync-dual-field-state-control-fn.type';
import { SyncDualFieldValueControlFn } from './control-functions/dual-fields/sync-dual-field-value-control-fn.type';
import { AsyncFieldStateControlFn } from './control-functions/fields/async-field-state-control-fn.type';
import { AsyncFieldValueControlFn } from './control-functions/fields/async-field-value-control-fn.type';
import { SyncFieldStateControlFn } from './control-functions/fields/sync-field-state-control-fn.type';
import { SyncFieldValueControlFn } from './control-functions/fields/sync-field-value-control-fn.type';
import { StateControlledDualField } from './state-controlled-dual-field';
import { StateControlledField } from './state-controlled-field';
import { ValueControlledDualField } from './value-controlled-dual-field';
import { ValueControlledField } from './value-controlled-field';

interface ControlledFieldFactory {
  createStateControlledFieldWithSyncAdapter(
    baseField: AbstractField,
    stateControlFn: SyncDualFieldStateControlFn | SyncFieldStateControlFn,
    fields: FormElementDictionary,
  ): StateControlledDualField | StateControlledField;

  createStateControlledFieldWithAsyncAdapter(
    baseField: AbstractField,
    stateControlFn: AsyncDualFieldStateControlFn | AsyncFieldStateControlFn,
    fields: FormElementDictionary,
  ): StateControlledDualField | StateControlledField;

  createValueControlledFieldWithSyncAdapter(
    baseField: AbstractField,
    valueControlFn: SyncDualFieldValueControlFn | SyncFieldValueControlFn,
    fields: FormElementDictionary,
  ): ValueControlledDualField | ValueControlledField;

  createValueControlledFieldWithAsyncAdapter(
    baseField: AbstractField,
    valueControlFn: AsyncDualFieldValueControlFn | AsyncFieldValueControlFn,
    fields: FormElementDictionary,
  ): ValueControlledDualField | ValueControlledField;
}
const ControlledFieldFactoryKey = 'ControlledFieldFactory';
type ControlledFieldFactoryKeyType = typeof ControlledFieldFactoryKey;

export {
  ControlledFieldFactoryKey,
  type ControlledFieldFactory,
  type ControlledFieldFactoryKeyType,
};
