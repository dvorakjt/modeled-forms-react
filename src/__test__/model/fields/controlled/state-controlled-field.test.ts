import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../../model/container';
import { FormElementDictionary } from '../../../../model/form-elements/form-element-dictionary.type';
import { SyncFieldStateControlFn } from '../../../../model/fields/controlled/control-functions/fields/sync-field-state-control-fn.type';
import { FieldState, MessageType, Validity } from '../../../../model';
import { Modified } from '../../../../model/state/modified.enum';
import { Visited } from '../../../../model/state/visited.enum';

describe('StateControlledField', () => {
  const baseFieldFactory = container.services.BaseFieldFactory;
  const controlledFieldFactory = container.services.ControlledFieldFactory;
  const simpleControlFn : SyncFieldStateControlFn = ({ fieldA }) => {
    if(fieldA.value) {
      return {
        value : fieldA.value.toUpperCase(),
        validity : Validity.VALID_FINALIZABLE
      }
    }

    return {
      value : '',
      validity : Validity.INVALID
    }
  }

  test('It updates the internal field\'s state when it receives a value from its adapter.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldB, simpleControlFn, fields);
    fieldA.setValue('test');
    expect(controlledField.state.value).toBe('TEST');
  });

  test('It updates the internal field\'s state accordingly when the adapter produces an error.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const errorThrowingFn : SyncFieldStateControlFn = ({ fieldA }) => {
      throw new Error('Adaptation of fieldA has resulted in an error.');
    }
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldA, errorThrowingFn, fields);
    const expectedState = {
      value: '',
      validity: Validity.ERROR,
      messages: [
        {
          type: 'ERROR',
          text: "An unexpected error occurred while generating this field's value."
        }
      ],
      omit: false,
      visited: Visited.NO,
      modified: Modified.YES
    }
    expect(controlledField.state).toStrictEqual(expectedState);
  });

  test('Getting stateChanges returns the internal field\'s stateChanges object.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldB, simpleControlFn, fields);
    expect(controlledField.stateChanges).toBe(fieldB.stateChanges);
  });

  test('Getting state returns the internal field\'s state.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldB, simpleControlFn, fields);
    
    const expectedState : FieldState = {
      value : 'test',
      validity : Validity.PENDING,
      messages : [
        {
          type : MessageType.PENDING,
          text : 'test message'
        }
      ],
      visited : Visited.YES,
      modified : Modified.YES,
      omit : true
    }

    fieldB.setState(expectedState);
    expect(controlledField.state).toStrictEqual(expectedState);
  });

  test('Setting omit sets the internal field\'s omit property.', () => {
    const initialOmit = false;
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', initialOmit, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldB, simpleControlFn, fields);
    controlledField.omit = !initialOmit;
    expect(fieldB.omit).toBe(!initialOmit);
  });


  test('Getting omit returns the internal field\'s omit property.', () => {
    const initialOmit = false;
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', initialOmit, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldB, simpleControlFn, fields);
    fieldB.omit = !initialOmit;
    expect(controlledField.omit).toBe(!initialOmit);
  });

  test('Calling setValue() calls the internal field\'s setValue() method.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldB, simpleControlFn, fields);

    vi.spyOn(fieldB, 'setValue');
    controlledField.setValue('test');
    expect(fieldB.setValue).toHaveBeenCalledWith('test');
  });

  test('Calling setState() calls the internal field\'s setState() method.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldB, simpleControlFn, fields);

    vi.spyOn(fieldB, 'setState');
    
    const expectedState : FieldState = {
      value : 'test',
      validity : Validity.PENDING,
      messages : [
        {
          type : MessageType.PENDING,
          text : 'test message'
        }
      ],
      visited : Visited.YES,
      modified : Modified.YES,
      omit : true
    }

    controlledField.setState(expectedState);
    expect(fieldB.setState).toHaveBeenCalledWith(expectedState);
  });

  test('Calling reset() calls the internal field\'s reset() method.', () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields : FormElementDictionary = { fieldA, fieldB };
    const controlledField = controlledFieldFactory.createStateControlledFieldWithSyncAdapter(fieldB, simpleControlFn, fields);

    vi.spyOn(fieldB, 'reset');

    controlledField.reset();
    expect(fieldB.reset).toHaveBeenCalledOnce();
  });
});