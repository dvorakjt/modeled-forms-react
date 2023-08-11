import { StateControlledDualField } from "./state-controlled-dual-field";
import { StateControlledField } from "./state-controlled-field";
import { ValueControlledDualField } from "./value-controlled-dual-field";
import { ValueControlledField } from "./value-controlled-field";
import { FormElementMap } from "../../form-elements/form-element-map.type";
import { AsyncDualFieldStateControlFn } from "./control-functions/dual-fields/async-dual-field-state-control-fn.type";
import { AsyncDualFieldValueControlFn } from "./control-functions/dual-fields/async-dual-field-value-control-fn.type";
import { AsyncFieldStateControlFn } from "./control-functions/fields/async-field-state-control-fn.type";
import { AsyncFieldValueControlFn } from "./control-functions/fields/async-field-value-control-fn.type";
import { DualField } from "../base/dual-field.interface";
import { Field } from "../base/field.interface";
import { SyncDualFieldStateControlFn } from "./control-functions/dual-fields/sync-dual-field-state-control-fn.type";
import { SyncDualFieldValueControlFn } from "./control-functions/dual-fields/sync-dual-field-value-control-fn.type";
import { SyncFieldStateControlFn } from "./control-functions/fields/sync-field-state-control-fn.type";
import { SyncFieldValueControlFn } from "./control-functions/fields/sync-field-value-control-fn.type";

export interface ControlledFieldFactory {
  createStateControlledFieldWithSyncControlFn(
    baseField : Field,
    stateControlFn : SyncFieldStateControlFn,
    fields : FormElementMap
  ) : StateControlledField;
  createStateControlledFieldWithAsyncControlFn(
    baseField : Field,
    stateControlFn : AsyncFieldStateControlFn,
    fields : FormElementMap
  ) : StateControlledField;
  createValueControlledFieldWithSyncControlFn(
    baseField : Field,
    valueControlFn : SyncFieldValueControlFn,
    fields : FormElementMap
  ) : ValueControlledField;
  createValueControlledFieldWithAsyncControlFn(
    baseField : Field,
    valueControlFn : AsyncFieldValueControlFn,
    fields : FormElementMap
  ) : ValueControlledField;
  createStateControlledDualFieldWithSyncControlFn(
    baseField : DualField,
    stateControlFn : SyncDualFieldStateControlFn,
    fields : FormElementMap
  ) : StateControlledDualField;
  createStateControlledDualFieldWithAsyncControlFn(
    baseField : DualField,
    stateControlFn : AsyncDualFieldStateControlFn,
    fields : FormElementMap
  ) : StateControlledDualField;
  createValueControlledDualFieldWithSyncControlFn(
    baseField : DualField,
    valueControlFn : SyncDualFieldValueControlFn,
    fields : FormElementMap
  ) : ValueControlledDualField;
  createValueControlledDualFieldWithAsyncControlFn(
    baseField : DualField,
    valueControlFn : AsyncDualFieldValueControlFn,
    fields : FormElementMap
  ) : ValueControlledDualField;
}