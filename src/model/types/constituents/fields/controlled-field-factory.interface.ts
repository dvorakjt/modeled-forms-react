import { StateControlledDualField } from "../../../constituents/fields/state-controlled-dual-field";
import { StateControlledField } from "../../../constituents/fields/state-controlled-field";
import { ValueControlledDualField } from "../../../constituents/fields/value-controlled-dual-field";
import { ValueControlledField } from "../../../constituents/fields/value-controlled-field";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { AsyncDualStateControlFn } from "./async-dual-state-control-fn.type";
import { AsyncDualValueControlFn } from "./async-dual-value-control-fn.type";
import { AsyncFieldStateControlFn } from "./async-field-state-control-fn.type";
import { AsyncFieldValueControlFn } from "./async-field-value-control-fn.type";
import { DualField } from "./dual-field.interface";
import { Field } from "./field.interface";
import { SyncDualValueControlFn } from "./sync-dual-value-control-fn.type";
import { SyncFieldStateControlFn } from "./sync-field-state-control-fn.type";
import { SyncFieldValueControlFn } from "./sync-field-value-control-fn.type";

export interface ControlledFieldFactory {
  createStateControlledFieldWithSyncControlFn<Fields extends FormElementMap>(
    baseField : Field,
    stateControlFn : SyncFieldStateControlFn<Fields>,
    fields : Fields
  ) : StateControlledField;
  createStateControlledFieldWithAsyncControlFn<Fields extends FormElementMap>(
    baseField : Field,
    stateControlFn : AsyncFieldStateControlFn<Fields>,
    fields : Fields
  ) : StateControlledField;
  createValueControlledFieldWithSyncControlFn<Fields extends FormElementMap>(
    baseField : Field,
    valueControlFn : SyncFieldValueControlFn<Fields>,
    fields : Fields
  ) : ValueControlledField;
  createValueControlledFieldWithAsyncControlFn<Fields extends FormElementMap>(
    baseField : Field,
    valueControlFn : AsyncFieldValueControlFn<Fields>,
    fields : Fields
  ) : ValueControlledField;
  createStateControlledDualFieldWithSyncControlFn<Fields extends FormElementMap>(
    baseField : DualField,
    stateControlFn : SyncFieldStateControlFn<Fields>,
    fields : Fields
  ) : StateControlledDualField;
  createStateControlledDualFieldWithAsyncControlFn<Fields extends FormElementMap>(
    baseField : DualField,
    stateControlFn : AsyncDualStateControlFn<Fields>,
    fields : Fields
  ) : StateControlledDualField;
  createValueControlledDualFieldWithSyncControlFn<Fields extends FormElementMap>(
    baseField : DualField,
    valueControlFn : SyncDualValueControlFn<Fields>,
    fields : Fields
  ) : ValueControlledDualField;
  createValueControlledDualFieldWithAsyncControlFn<Fields extends FormElementMap>(
    baseField : DualField,
    valueControlFn : AsyncDualValueControlFn<Fields>,
    fields : Fields
  ) : ValueControlledDualField;
}