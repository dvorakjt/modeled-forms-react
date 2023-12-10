import { describe, test, expect, vi } from 'vitest';
import { DualField } from '../../../../model/fields/base/dual-field';
import { MockField } from '../../../util/mocks/mock-field';
import { FieldState, Focused, MessageType, Validity } from '../../../../model';
import { Modified } from '../../../../model/state/modified.enum';
import { Visited } from '../../../../model/state/visited.enum';

describe('DualField', () => {
  test('It returns the state of its primaryField when _useSecondaryField is false.', () => {
    const primaryField = new MockField('primary', Validity.VALID_FINALIZABLE, [
      { type: MessageType.VALID, text: 'the primary field is valid' },
    ]);
    const secondaryField = new MockField('secondary', Validity.INVALID, [
      { type: MessageType.INVALID, text: 'the secondary field is invalid' },
    ]);
    const dualField = new DualField(primaryField, secondaryField, false);

    expect(dualField.state).toStrictEqual({
      value: 'primary',
      validity: Validity.VALID_FINALIZABLE,
      messages: [
        {
          type: MessageType.VALID,
          text: 'the primary field is valid',
        },
      ],
      modified: Modified.NO,
      visited: Visited.NO,
      focused: Focused.NO,
      omit: false,
      useSecondaryField: false,
    });
  });

  test('It returns the state of its secondaryField when _useSecondaryField is true.', () => {
    const primaryField = new MockField('primary', Validity.VALID_FINALIZABLE, [
      { type: MessageType.VALID, text: 'the primary field is valid' },
    ]);
    const secondaryField = new MockField('secondary', Validity.INVALID, [
      { type: MessageType.INVALID, text: 'the secondary field is invalid' },
    ]);
    const dualField = new DualField(primaryField, secondaryField, false);

    dualField.useSecondaryField = true;

    expect(dualField.state).toStrictEqual({
      value: 'secondary',
      validity: Validity.INVALID,
      messages: [
        {
          type: MessageType.INVALID,
          text: 'the secondary field is invalid',
        },
      ],
      modified: Modified.NO,
      visited: Visited.NO,
      focused: Focused.NO,
      omit: false,
      useSecondaryField: true,
    });
  });

  test("Setting omit updates the field's omit property.", () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);
    dualField.omit = true;
    expect(dualField.omit).toBe(true);
  });

  test('When setValue() is called with an object which has a primaryFieldValue property, setValue is called on the primaryField.', () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);
    vi.spyOn(primaryField, 'setValue');
    dualField.setValue({ primaryFieldValue: 'test' });
    expect(primaryField.setValue).toHaveBeenCalledWith('test');
  });

  test('When setValue() is called with an object which has a secondaryFieldValue property, setValue is called on the secondaryField.', () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);
    vi.spyOn(secondaryField, 'setValue');
    dualField.setValue({ secondaryFieldValue: 'test' });
    expect(secondaryField.setValue).toHaveBeenCalledWith('test');
  });

  test('When setValue() is called with an object which has a useSecondaryField property, _useSecondaryField is set accordingly.', () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);

    dualField.setValue({ useSecondaryField: true });
    expect(dualField.useSecondaryField).toBe(true);

    dualField.setValue({});
    expect(dualField.useSecondaryField).toBe(true);

    dualField.setValue({ useSecondaryField: false });
    expect(dualField.useSecondaryField).toBe(false);
  });

  test('When setState() is called with an object which has an omit property, _omit is set accordingly.', () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);

    dualField.setState({ omit: true });
    expect(dualField.omit).toBe(true);

    dualField.setState({});
    expect(dualField.omit).toBe(true);

    dualField.setState({ omit: false });
    expect(dualField.omit).toBe(false);
  });

  test('When setState() is called with an object which has a primaryFieldState property, setState is called on the primaryField.', () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);

    const expectedState: FieldState = {
      value: 'new value',
      validity: Validity.PENDING,
      messages: [
        {
          type: MessageType.PENDING,
          text: "the field's validity is pending",
        },
      ],
      visited: Visited.YES,
      modified: Modified.YES,
      focused: Focused.YES,
      omit: false,
    };

    dualField.setState({ primaryFieldState: expectedState });
    expect(primaryField.state).toStrictEqual(expectedState);
  });

  test('When setState() is called with an object which has a secondaryFieldState property, setState is called on the secondaryField.', () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);

    const expectedState: FieldState = {
      value: 'new value',
      validity: Validity.PENDING,
      messages: [
        {
          type: MessageType.PENDING,
          text: "the field's validity is pending",
        },
      ],
      visited: Visited.YES,
      modified: Modified.YES,
      focused: Focused.YES,
      omit: false,
    };

    dualField.setState({ secondaryFieldState: expectedState });
    expect(secondaryField.state).toStrictEqual(expectedState);
  });

  test('When setState() is called with an object which has a useSecondaryField property, _useSecondaryField is set accordingly.', () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);

    dualField.setState({ useSecondaryField: true });
    expect(dualField.useSecondaryField).toBe(true);

    dualField.setState({});
    expect(dualField.useSecondaryField).toBe(true);

    dualField.setState({ useSecondaryField: false });
    expect(dualField.useSecondaryField).toBe(false);
  });

  test('When reset() is called, _omit is set to _omitByDefault.', () => {
    const omitByDefault = false;
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(
      primaryField,
      secondaryField,
      omitByDefault,
    );

    dualField.omit = !omitByDefault;

    dualField.reset();

    expect(dualField.omit).toBe(omitByDefault);
  });

  test('When reset() is called, reset() is called on both the primary and secondary fields.', () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);

    vi.spyOn(primaryField, 'reset');
    vi.spyOn(secondaryField, 'reset');

    dualField.reset();

    expect(primaryField.reset).toHaveBeenCalledOnce();
    expect(secondaryField.reset).toHaveBeenCalledOnce();
  });

  test('When reset() is called, _useSecondaryField is set to false.', () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const dualField = new DualField(primaryField, secondaryField, false);

    dualField.useSecondaryField = true;
    dualField.reset();

    expect(dualField.useSecondaryField).toBe(false);
  });
});
