import { describe, test, expect } from 'vitest';
import { container } from '../../../../model/container';
import { ControlledFieldFactoryImpl } from '../../../../model/fields/controlled/controlled-field-factory-impl';
import { FormElementDictionary } from '../../../../model/form-elements/form-element-dictionary.type';
import { SyncFieldStateControlFn } from '../../../../model/fields/controlled/control-functions/fields/sync-field-state-control-fn.type';
import { Validity } from '../../../../model';
import { StateControlledField } from '../../../../model/fields/controlled/state-controlled-field';

describe('ControlledFieldFactory', () => {
  const controlledFieldFactory = new ControlledFieldFactoryImpl(container.services.AdapterFactory);

  test('createStateControlledFieldWithSyncAdapter() returns a StateControlledField when a Field is passed in as an argument.', () => {
    const baseFieldFactory = container.services.BaseFieldFactory;
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };
    const stateControlFn : SyncFieldStateControlFn = ({ fieldA }) => ({ value : fieldA.value.repeat(3), validity : fieldA.value.length > 0 ? Validity.VALID_FINALIZABLE : Validity.INVALID});
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldB, stateControlFn, fields);
    expect(controlledField).toBeInstanceOf(StateControlledField);
  });
});