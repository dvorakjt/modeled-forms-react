import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../../model/container';
import { SyncDualFieldValueControlFn } from '../../../../model/fields/controlled/control-functions/dual-fields/sync-dual-field-value-control-fn.type';
import { MessageType, Validity } from '../../../../model';
import { Visited } from '../../../../model/state/visited.enum';
import { Modified } from '../../../../model/state/modified.enum';
import { ValueControlledDualField } from '../../../../model/fields/controlled/value-controlled-dual-field';
import { Focused } from '../../../../index';

describe('ValueControlledDualField', () => {
  const baseFieldFactory = container.services.BaseFieldFactory;
  const controlledFieldFactory = container.services.ControlledFieldFactory;
  const { config } = container.services.ConfigLoader;

  const simpleControlFn: SyncDualFieldValueControlFn = ({ fieldA }) => ({
    primaryFieldValue: fieldA.value.toUpperCase(),
    useSecondaryField: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const errantControlFn: SyncDualFieldValueControlFn = ({ fieldA }) => {
    throw new Error('adaptation of FieldA resulted in an error.');
  };

  test("It updates the internal field's value when it receives a value from the adapter.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );
    fieldB.setState({
      secondaryFieldState: {
        value: 'secondary value',
      },
      useSecondaryField: true,
    });
    fieldA.setValue('new value');
    expect(controlledField.state.value).toBe('NEW VALUE');
    expect(controlledField.state.useSecondaryField).toBe(false);
  });

  test("When it receives an error from the adapter, if useSecondaryField is false, it sets the primaryField's state to an expected error state.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
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
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
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
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
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
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    const expectedPrimaryState = {
      value: '',
      validity: Validity.VALID_FINALIZABLE,
      useSecondaryField: false,
      messages: [],
      omit: false,
      visited: Visited.NO,
      modified: Modified.NO,
      focused: Focused.NO
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
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
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
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
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
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );
    expect((controlledField as ValueControlledDualField).primaryField).toBe(
      fieldB.primaryField,
    );
  });

  test("getting the field's secondaryField property returns the inner field's primary field property.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );
    expect((controlledField as ValueControlledDualField).secondaryField).toBe(
      fieldB.secondaryField,
    );
  });

  test("getting the field's useSecondaryField property returns the internal field's useSecondaryField property.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    expect(
      (controlledField as ValueControlledDualField).useSecondaryField,
    ).toBe(false);

    fieldB.useSecondaryField = true;
    expect(
      (controlledField as ValueControlledDualField).useSecondaryField,
    ).toBe(true);
  });

  test("setting the field's useSecondaryField property sets the internal field's useSecondaryField property.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    expect(fieldB.useSecondaryField).toBe(false);

    (controlledField as ValueControlledDualField).useSecondaryField = true;
    expect(fieldB.useSecondaryField).toBe(true);
  });

  test("Calling setValue() calls the internal field's setValue() method.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    vi.spyOn(fieldB, 'setValue');
    const setValueArg = { primaryFieldValue: 'test' };
    (controlledField as ValueControlledDualField).setValue(setValueArg);
    expect(fieldB.setValue).toHaveBeenCalledWith(setValueArg);
  });

  test("Calling setState() calls the internal field's setState() method.", () => {
    const fieldA = baseFieldFactory.createField('', false, [], []);
    const fieldB = baseFieldFactory.createDualField('', '', false, [], []);
    const fields = { fieldA, fieldB };
    const controlledField =
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
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
      controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
        fieldB,
        simpleControlFn,
        fields,
      );

    vi.spyOn(fieldB, 'reset');

    controlledField.reset();
    expect(fieldB.reset).toHaveBeenCalledOnce();
  });
});
