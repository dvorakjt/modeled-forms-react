import { AdapterFactory } from "../../types/constituents/adapters/adapter-factory.interface";
import { AsyncDualStateControlFn } from "../../types/constituents/fields/async-dual-state-control-fn.type";
import { AsyncDualValueControlFn } from "../../types/constituents/fields/async-dual-value-control-fn.type";
import { AsyncFieldStateControlFn } from "../../types/constituents/fields/async-field-state-control-fn.type";
import { AsyncFieldValueControlFn } from "../../types/constituents/fields/async-field-value-control-fn.type";
import { ControlledFieldFactory } from "../../types/constituents/fields/controlled-field-factory.interface";
import { DualField } from "../../types/constituents/fields/dual-field.interface";
import { Field } from "../../types/constituents/fields/field.interface";
import { SyncDualStateControlFn } from "../../types/constituents/fields/sync-dual-state-control-fn.type";
import { SyncDualValueControlFn } from "../../types/constituents/fields/sync-dual-value-control-fn.type";
import { SyncFieldStateControlFn } from "../../types/constituents/fields/sync-field-state-control-fn.type";
import { SyncFieldValueControlFn } from "../../types/constituents/fields/sync-field-value-control-fn.type";
import { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import { DualFieldSetStateArg } from "../../types/constituents/state/dual-field-set-state-arg.interface";
import { DualFieldSetValueArg } from "../../types/constituents/state/dual-field-set-value-arg.interface";
import { FieldState } from "../../types/constituents/state/field-state.interface";
import { AsyncAdapter } from "../adapters/async-adapter";
import { SyncAdapter } from "../adapters/sync-adapter";
import { StateControlledDualField } from "./state-controlled-dual-field";
import { StateControlledField } from "./state-controlled-field";
import { ValueControlledDualField } from "./value-controlled-dual-field";
import { ValueControlledField } from "./value-controlled-field";

export class ControlledFieldFactoryImpl implements ControlledFieldFactory {
  readonly #adapterFactory : AdapterFactory;

  constructor(adapterFactory : AdapterFactory) {
    this.#adapterFactory = adapterFactory;
  }
  createStateControlledFieldWithSyncControlFn<Fields extends FormElementMap>(baseField: Field, stateControlFn: SyncFieldStateControlFn<Fields>, fields: Fields): StateControlledField {
    const adapter = this.#adapterFactory.createSyncAdapterFromFnWithFields(stateControlFn, fields);
    return new StateControlledField(baseField, adapter as SyncAdapter<Fields, FieldState | DualFieldSetStateArg>);
  }
  createStateControlledFieldWithAsyncControlFn<Fields extends FormElementMap>(baseField: Field, stateControlFn: AsyncFieldStateControlFn<Fields>, fields: Fields): StateControlledField {
    const adapter = this.#adapterFactory.createAsyncAdapterFromFnWithFields(stateControlFn, fields);
    return new StateControlledField(baseField, adapter as AsyncAdapter<Fields, FieldState | DualFieldSetStateArg>);
  }
  createValueControlledFieldWithSyncControlFn<Fields extends FormElementMap>(baseField: Field, valueControlFn: SyncFieldValueControlFn<Fields>, fields: Fields): ValueControlledField {
    const adapter = this.#adapterFactory.createSyncAdapterFromFnWithFields(valueControlFn, fields);
    return new ValueControlledField(baseField, adapter as SyncAdapter<Fields, string | DualFieldSetValueArg | undefined>);
  }
  createValueControlledFieldWithAsyncControlFn<Fields extends FormElementMap>(baseField: Field, valueControlFn: AsyncFieldValueControlFn<Fields>, fields: Fields): ValueControlledField {
    const adapter = this.#adapterFactory.createAsyncAdapterFromFnWithFields(valueControlFn, fields);
    return new ValueControlledField(baseField, adapter as AsyncAdapter<Fields, string | DualFieldSetValueArg | undefined>);
  }
  createStateControlledDualFieldWithSyncControlFn<Fields extends FormElementMap>(baseField: DualField, stateControlFn: SyncDualStateControlFn<Fields>, fields: Fields): StateControlledDualField {
    const adapter = this.#adapterFactory.createSyncAdapterFromFnWithFields(stateControlFn, fields);
    return new StateControlledDualField(baseField, adapter);
  }
  createStateControlledDualFieldWithAsyncControlFn<Fields extends FormElementMap>(baseField: DualField, stateControlFn: AsyncDualStateControlFn<Fields>, fields: Fields): StateControlledDualField {
    const adapter = this.#adapterFactory.createAsyncAdapterFromFnWithFields(stateControlFn, fields);
    return new StateControlledDualField(baseField, adapter);
  }
  createValueControlledDualFieldWithSyncControlFn<Fields extends FormElementMap>(baseField: DualField, valueControlFn: SyncDualValueControlFn<Fields>, fields: Fields): ValueControlledDualField {
    const adapter = this.#adapterFactory.createSyncAdapterFromFnWithFields(valueControlFn, fields);
    return new ValueControlledDualField(baseField, adapter as SyncAdapter<Fields, string | DualFieldSetValueArg | undefined>);
  }
  createValueControlledDualFieldWithAsyncControlFn<Fields extends FormElementMap>(baseField: DualField, valueControlFn: AsyncDualValueControlFn<Fields>, fields: Fields): ValueControlledDualField {
    const adapter = this.#adapterFactory.createAsyncAdapterFromFnWithFields(valueControlFn, fields);
    return new ValueControlledDualField(baseField, adapter as AsyncAdapter<Fields, string | DualFieldSetValueArg | undefined>);
  }
}