import {
  AdapterFactory,
  AdapterFactoryKey,
} from '../../adapters/adapter-factory.interface';
import { AsyncDualFieldStateControlFn } from './control-functions/dual-fields/async-dual-field-state-control-fn.type';
import { AsyncDualFieldValueControlFn } from './control-functions/dual-fields/async-dual-field-value-control-fn.type';
import { AsyncFieldStateControlFn } from './control-functions/fields/async-field-state-control-fn.type';
import { AsyncFieldValueControlFn } from './control-functions/fields/async-field-value-control-fn.type';
import {
  ControlledFieldFactory,
  ControlledFieldFactoryKey,
  ControlledFieldFactoryKeyType,
} from './controlled-field-factory.interface';
import { DualField } from '../base/dual-field.interface';
import { Field } from '../base/field.interface';
import { SyncDualFieldStateControlFn } from './control-functions/dual-fields/sync-dual-field-state-control-fn.type';
import { SyncDualFieldValueControlFn } from './control-functions/dual-fields/sync-dual-field-value-control-fn.type';
import { SyncFieldStateControlFn } from './control-functions/fields/sync-field-state-control-fn.type';
import { SyncFieldValueControlFn } from './control-functions/fields/sync-field-value-control-fn.type';
import { FormElementMap } from '../../form-elements/form-element-map.type';
import { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import { FieldState } from '../../state/field-state.interface';
import { AsyncAdapter } from '../../adapters/async-adapter';
import { SyncAdapter } from '../../adapters/sync-adapter';
import { StateControlledDualField } from './state-controlled-dual-field';
import { StateControlledField } from './state-controlled-field';
import { ValueControlledDualField } from './value-controlled-dual-field';
import { ValueControlledField } from './value-controlled-field';
import { autowire } from 'undecorated-di';

class ControlledFieldFactoryImpl implements ControlledFieldFactory {
  readonly #adapterFactory: AdapterFactory;

  constructor(adapterFactory: AdapterFactory) {
    this.#adapterFactory = adapterFactory;
  }
  createStateControlledFieldWithSyncControlFn(
    baseField: Field,
    stateControlFn: SyncFieldStateControlFn,
    fields: FormElementMap,
  ): StateControlledField {
    const adapter = this.#adapterFactory.createSyncAdapterFromFnWithFields(
      stateControlFn,
      fields,
    );
    return new StateControlledField(
      baseField,
      adapter as SyncAdapter<FieldState | DualFieldSetStateArg>,
    );
  }
  createStateControlledFieldWithAsyncControlFn(
    baseField: Field,
    stateControlFn: AsyncFieldStateControlFn,
    fields: FormElementMap,
  ): StateControlledField {
    const adapter = this.#adapterFactory.createAsyncAdapterFromFnWithFields(
      stateControlFn,
      fields,
    );
    return new StateControlledField(
      baseField,
      adapter as AsyncAdapter<FieldState | DualFieldSetStateArg>,
    );
  }
  createValueControlledFieldWithSyncControlFn(
    baseField: Field,
    valueControlFn: SyncFieldValueControlFn,
    fields: FormElementMap,
  ): ValueControlledField {
    const adapter = this.#adapterFactory.createSyncAdapterFromFnWithFields(
      valueControlFn,
      fields,
    );
    return new ValueControlledField(
      baseField,
      adapter as SyncAdapter<string | DualFieldSetValueArg | undefined>,
    );
  }
  createValueControlledFieldWithAsyncControlFn(
    baseField: Field,
    valueControlFn: AsyncFieldValueControlFn,
    fields: FormElementMap,
  ): ValueControlledField {
    const adapter = this.#adapterFactory.createAsyncAdapterFromFnWithFields(
      valueControlFn,
      fields,
    );
    return new ValueControlledField(
      baseField,
      adapter as AsyncAdapter<string | DualFieldSetValueArg | undefined>,
    );
  }
  createStateControlledDualFieldWithSyncControlFn(
    baseField: DualField,
    stateControlFn: SyncDualFieldStateControlFn,
    fields: FormElementMap,
  ): StateControlledDualField {
    const adapter = this.#adapterFactory.createSyncAdapterFromFnWithFields(
      stateControlFn,
      fields,
    );
    return new StateControlledDualField(baseField, adapter);
  }
  createStateControlledDualFieldWithAsyncControlFn(
    baseField: DualField,
    stateControlFn: AsyncDualFieldStateControlFn,
    fields: FormElementMap,
  ): StateControlledDualField {
    const adapter = this.#adapterFactory.createAsyncAdapterFromFnWithFields(
      stateControlFn,
      fields,
    );
    return new StateControlledDualField(baseField, adapter);
  }
  createValueControlledDualFieldWithSyncControlFn(
    baseField: DualField,
    valueControlFn: SyncDualFieldValueControlFn,
    fields: FormElementMap,
  ): ValueControlledDualField {
    const adapter = this.#adapterFactory.createSyncAdapterFromFnWithFields(
      valueControlFn,
      fields,
    );
    return new ValueControlledDualField(
      baseField,
      adapter as SyncAdapter<string | DualFieldSetValueArg | undefined>,
    );
  }
  createValueControlledDualFieldWithAsyncControlFn(
    baseField: DualField,
    valueControlFn: AsyncDualFieldValueControlFn,
    fields: FormElementMap,
  ): ValueControlledDualField {
    const adapter = this.#adapterFactory.createAsyncAdapterFromFnWithFields(
      valueControlFn,
      fields,
    );
    return new ValueControlledDualField(
      baseField,
      adapter as AsyncAdapter<string | DualFieldSetValueArg | undefined>,
    );
  }
}

const ControlledFieldFactoryService = autowire<
  ControlledFieldFactoryKeyType,
  ControlledFieldFactory,
  ControlledFieldFactoryImpl
>(ControlledFieldFactoryImpl, ControlledFieldFactoryKey, [AdapterFactoryKey]);

export { ControlledFieldFactoryImpl, ControlledFieldFactoryService };
