import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../../model/container';
import { SyncDualFieldStateControlFn } from '../../../../model/fields/controlled/control-functions/dual-fields/sync-dual-field-state-control-fn.type';
import { Focused, MessageType, Validity, required } from '../../../../model';
import { Visited } from '../../../../model/state/visited.enum';
import { Modified } from '../../../../model/state/modified.enum';
import { StateControlledDualField } from '../../../../model/fields/controlled/state-controlled-dual-field';

describe('StateControlledDualField', () => {
  const baseFieldFactory = container.services.BaseFieldFactory;
  const controlledFieldFactory = container.services.ControlledFieldFactory;
  const { config } = container.services.ConfigLoader;

  const simpleControlFn: SyncDualFieldStateControlFn = ({ fieldA }) => {
    return {
      primaryFieldState: {
        value:
          fieldA.validity === Validity.VALID_FINALIZABLE
            ? fieldA.value.toUpperCase()
            : '',
        validity: fieldA.validity,
      },
      useSecondaryField: false,
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const errantControlFn: SyncDualFieldStateControlFn = ({ fieldA }) => {
    throw new Error('adaptation of FieldA resulted in an error.');
  };

  test("It updates the internal field's state when it receives state from the adapter.", () => {
    const fieldA = baseFieldFactory.createField(
      '',
      false,
      [required('Field A is a required field.')],
      [],
    );
    const fieldB = baseFieldFactory.createDualField('test', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );
    expect(controlledField.state.value).toBe('');
    expect(controlledField.state.validity).toBe(Validity.INVALID);

    fieldA.setValue('new value');
    expect(controlledField.state.value).toBe('NEW VALUE');
    expect(controlledField.state.validity).toBe(Validity.VALID_FINALIZABLE);
  });

  test("When it receives an error from the adapter, if useSecondaryField is false, it sets the primaryField's state to an expected error state.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        errantControlFn,
        fields,
      );
    expect(controlledField.state).toStrictEqual({
      value: '',
      validity: Validity.ERROR,
      messages: [
        {
          type: MessageType.ERROR,
          text: config.globalMessages.adapterError,
        },
      ],
      useSecondaryField: false,
      visited: Visited.NO,
      modified: Modified.YES,
      focused: Focused.NO,
      omit: false,
    });
  });

  test("When it receives an error from the adapter, if useSecondaryField is true, it sets the secondaryField's state to an expected error state.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    fieldB.useSecondaryField = true;
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        errantControlFn,
        fields,
      );
    expect(controlledField.state).toStrictEqual({
      value: '',
      validity: Validity.ERROR,
      messages: [
        {
          type: MessageType.ERROR,
          text: config.globalMessages.adapterError,
        },
      ],
      useSecondaryField: true,
      visited: Visited.NO,
      modified: Modified.YES,
      focused: Focused.NO,
      omit: false,
    });
  });

  test("get stateChanges returns the internal field's stateChanges when called.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );
    expect(controlledField.stateChanges).toBe(fieldB.stateChanges);
  });

  test("get state returns the internal field's state when called.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    const expectedPrimaryState = {
      value: '',
      validity: Validity.VALID_FINALIZABLE,
      messages: [],
      omit: false,
      visited: Visited.NO,
      modified: Modified.NO,
      focused: Focused.NO,
      useSecondaryField: false,
    };

    const expectedSecondaryState = {
      value: '',
      validity: Validity.ERROR,
      useSecondaryField: true,
      messages: [
        {
          type: MessageType.ERROR,
          text: "An unexpected error occurred while generating this field's value.",
        },
      ],
      omit: false,
      visited: Visited.NO,
      modified: Modified.YES,
      focused: Focused.NO
    };

    fieldB.setState({
      secondaryFieldState: expectedSecondaryState,
    });

    expect(controlledField.state).toStrictEqual(expectedPrimaryState);

    fieldB.useSecondaryField = true;
    expect(controlledField.state).toStrictEqual(expectedSecondaryState);
  });

  test("getting the field's omit property returns the internal field's omit property.", () => {
    const initialOmit = false;
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField(
      '',
      '',
      initialOmit,
      [],
      [],
    );
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    expect(controlledField.omit).toBe(initialOmit);

    fieldB.omit = !initialOmit;
    expect(controlledField.omit).toBe(!initialOmit);
  });

  test("setting the field's omit property returns the internal field's omit property.", () => {
    const initialOmit = false;
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField(
      '',
      '',
      initialOmit,
      [],
      [],
    );
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    controlledField.omit = !initialOmit;
    expect(fieldB.omit).toBe(!initialOmit);
  });

  test("getting the field's primaryField property returns the inner field's primary field property.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );
    expect((controlledField as StateControlledDualField).primaryField).toBe(
      fieldB.primaryField,
    );
  });

  test("getting the field's secondaryField property returns the inner field's primary field property.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );
    expect((controlledField as StateControlledDualField).secondaryField).toBe(
      fieldB.secondaryField,
    );
  });

  test("getting the field's useSecondaryField property returns the internal field's useSecondaryField property.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    expect(
      (controlledField as StateControlledDualField).useSecondaryField,
    ).toBe(false);

    fieldB.useSecondaryField = true;
    expect(
      (controlledField as StateControlledDualField).useSecondaryField,
    ).toBe(true);
  });

  test("setting the field's useSecondaryField property sets the internal field's useSecondaryField property.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    expect(fieldB.useSecondaryField).toBe(false);

    (controlledField as StateControlledDualField).useSecondaryField = true;
    expect(fieldB.useSecondaryField).toBe(true);
  });

  test("Calling setValue() calls the internal field's setValue() method.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    vi.spyOn(fieldB, 'setValue');
    const setValueArg = { primaryFieldValue: 'test' };
    (controlledField as StateControlledDualField).setValue(setValueArg);
    expect(fieldB.setValue).toHaveBeenCalledWith(setValueArg);
  });

  test("Calling setState() calls the internal field's setState() method.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createField('', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    vi.spyOn(fieldB, 'setState');

    const setStateArg = {
      primaryFieldState: {
        value: 'test',
        validity: Validity.PENDING,
        messages: [
          {
            type: MessageType.PENDING,
            text: 'test message',
          },
        ],
        visited: Visited.YES,
        modified: Modified.YES,
        focused: Focused.YES,
        omit: true,
      },
    };
    controlledField.setState(setStateArg);
    expect(fieldB.setState).toHaveBeenCalledWith(setStateArg);
  });

  test("Calling reset() calls the internal field's reset() method.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    vi.spyOn(fieldB, 'reset');

    controlledField.reset();
    expect(fieldB.reset).toHaveBeenCalledOnce();
  });
});
