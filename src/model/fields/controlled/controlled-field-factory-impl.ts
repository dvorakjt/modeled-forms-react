import { autowire } from 'undecorated-di';
import {
  AdapterFactory,
  AdapterFactoryKey,
} from '../../adapters/adapter-factory.interface';
import { Adapter } from '../../adapters/adapter.interface';
import { FormElementDictionary } from '../../form-elements/form-element-dictionary.type';
import { DualFieldSetStateArg } from '../../state/dual-field-set-state-arg.interface';
import { DualFieldSetValueArg } from '../../state/dual-field-set-value-arg.interface';
import { FieldState } from '../../state/field-state.interface';
import { AbstractDualField } from '../base/abstract-dual-field';
import { AbstractField } from '../base/abstract-field';
import { AsyncDualFieldStateControlFn } from './control-functions/dual-fields/async-dual-field-state-control-fn.type';
import { AsyncDualFieldValueControlFn } from './control-functions/dual-fields/async-dual-field-value-control-fn.type';
import { SyncDualFieldStateControlFn } from './control-functions/dual-fields/sync-dual-field-state-control-fn.type';
import { SyncDualFieldValueControlFn } from './control-functions/dual-fields/sync-dual-field-value-control-fn.type';
import { AsyncFieldStateControlFn } from './control-functions/fields/async-field-state-control-fn.type';
import { AsyncFieldValueControlFn } from './control-functions/fields/async-field-value-control-fn.type';
import { SyncFieldStateControlFn } from './control-functions/fields/sync-field-state-control-fn.type';
import { SyncFieldValueControlFn } from './control-functions/fields/sync-field-value-control-fn.type';
import { ControlledFieldFactory } from './controlled-field-factory.interface';
import { StateControlledDualField } from './state-controlled-dual-field';
import { StateControlledField } from './state-controlled-field';
import { ValueControlledDualField } from './value-controlled-dual-field';
import { ValueControlledField } from './value-controlled-field';
import {
  ControlledFieldFactoryKey,
  ControlledFieldFactoryKeyType,
} from './controlled-field-factory.interface';

class ControlledFieldFactoryImpl implements ControlledFieldFactory {
  _adapterFactory: AdapterFactory;

  constructor(adapterFactory: AdapterFactory) {
    this._adapterFactory = adapterFactory;
  }

  createStateControlledFieldWithSyncAdapter(
    baseField: AbstractField,
    stateControlFn: SyncDualFieldStateControlFn | SyncFieldStateControlFn,
    fields: FormElementDictionary,
  ): StateControlledDualField | StateControlledField {
    const adapter = this._adapterFactory.createSyncAdapterFromFnWithFields<
      DualFieldSetStateArg | FieldState
    >(stateControlFn, fields);
    return baseField instanceof AbstractDualField
      ? new StateControlledDualField(
          baseField,
          adapter as unknown as Adapter<DualFieldSetStateArg>,
        )
      : new StateControlledField(
          baseField,
          adapter as unknown as Adapter<Partial<FieldState>>,
        );
  }

  createStateControlledFieldWithAsyncAdapter(
    baseField: AbstractField,
    stateControlFn: AsyncFieldStateControlFn | AsyncDualFieldStateControlFn,
    fields: FormElementDictionary,
  ): StateControlledDualField | StateControlledField {
    const adapter = this._adapterFactory.createAsyncAdapterFromFnWithFields<
      DualFieldSetStateArg | FieldState
    >(stateControlFn, fields);
    return baseField instanceof AbstractDualField
      ? new StateControlledDualField(
          baseField,
          adapter as unknown as Adapter<DualFieldSetStateArg>,
        )
      : new StateControlledField(
          baseField,
          adapter as unknown as Adapter<Partial<FieldState>>,
        );
  }
  createValueControlledFieldWithSyncAdapter(
    baseField: AbstractField,
    valueControlFn: SyncFieldValueControlFn | SyncDualFieldValueControlFn,
    fields: FormElementDictionary,
  ): ValueControlledField | ValueControlledDualField {
    const adapter = this._adapterFactory.createSyncAdapterFromFnWithFields<
      DualFieldSetValueArg | string | undefined
    >(valueControlFn, fields);
    return baseField instanceof AbstractDualField
      ? new ValueControlledDualField(
          baseField,
          adapter as unknown as Adapter<DualFieldSetValueArg>,
        )
      : new ValueControlledField(
          baseField,
          adapter as unknown as Adapter<string | undefined>,
        );
  }
  createValueControlledFieldWithAsyncAdapter(
    baseField: AbstractField,
    valueControlFn: AsyncFieldValueControlFn | AsyncDualFieldValueControlFn,
    fields: FormElementDictionary,
  ): ValueControlledField | ValueControlledDualField {
    const adapter = this._adapterFactory.createAsyncAdapterFromFnWithFields<
      DualFieldSetValueArg | string | undefined
    >(valueControlFn, fields);
    return baseField instanceof AbstractDualField
      ? new ValueControlledDualField(
          baseField,
          adapter as unknown as Adapter<DualFieldSetValueArg>,
        )
      : new ValueControlledField(
          baseField,
          adapter as unknown as Adapter<string | undefined>,
        );
  }
}

const ControlledFieldFactoryService = autowire<
  ControlledFieldFactoryKeyType,
  ControlledFieldFactory,
  ControlledFieldFactoryImpl
>(ControlledFieldFactoryImpl, ControlledFieldFactoryKey, [AdapterFactoryKey]);

export { ControlledFieldFactoryImpl, ControlledFieldFactoryService };
