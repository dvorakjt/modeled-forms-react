import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { DualFieldImpl } from "../../../model/fields/dual-field-impl";
import { SimpleField } from "../../../model/fields/simple-field";
import { DualField } from "../../../model/types/fields/dual-field.interface";
import { SubscriptionManagerImpl } from "../../../model/subscriptions/subscription-manager-impl";
import { SyncSingleInputValidatorSuiteStub } from "../stub/sync-single-input-validator-suite.stub";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import { Validity } from "../../../model/types/state/validity.enum";

describe('DualFieldImpl', () => {
  let field : DualField;
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();

    const validatorReturnValue = {
      value : "",
      validity: Validity.VALID_FINALIZABLE,
      messages: []
    }

    const primaryField = new SimpleField(
      new SyncSingleInputValidatorSuiteStub(subscriptionManager, validatorReturnValue), 
      "",
      subscriptionManager,
      false
    );

    const secondaryField = new SimpleField(
      new SyncSingleInputValidatorSuiteStub(subscriptionManager, validatorReturnValue), 
      "",
      subscriptionManager,
      false
    );

    field = new DualFieldImpl(primaryField, secondaryField, subscriptionManager, false);
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('setting useSecondaryField should update useSecondaryField.', () => {
    field.useSecondaryField = true;
    expect(field.useSecondaryField).toBe(true);
  });

  test('setting omit should updated omit.', () => {
    field.omit = true;
    expect(field.omit).toBe(true);
  });

  test('when secondaryField.stateChanges emits a new value while useSecondaryField is true, stateChanges should emit a new value.', () => {
    field.useSecondaryField = true;
    field.setValue({
      secondaryFieldValue : "test"
    });
    field.stateChanges?.subscribe(stateChange => {
      expect(stateChange.value).toBe("test");
    });
  });

  test('setValue should set primaryField.state when primaryFieldState is present in its argument.', () => {
    field.setValue({
      primaryFieldValue : 'test'
    });
    expect(field.primaryField.state.value).toBe('test');
  });

  test('setValue should set secondaryField.state when secondaryFieldState is present in its argument.', () => {

    field.setValue({
      secondaryFieldValue : 'test'
    });
    expect(field.secondaryField.state.value).toBe('test');
  });

  test('setValue should set useSecondaryField when present in its argument.', () => {
    field.setValue({
      useSecondaryField: true
    });
    expect(field.useSecondaryField).toBe(true);
  });

  test('setState should set omit when present in its argument.', () => {
    field.setState({
      omit: true
    });
    expect(field.omit).toBe(true);
  });

  test('setState should set primaryField.state when primaryFieldState is present in its argument.', () => {
    const expectedState = {
      value : "test",
      validity: Validity.VALID_FINALIZABLE,
      messages: []
    }
    field.setState({
      primaryFieldState: expectedState 
    });
    expect(field.primaryField.state).toStrictEqual(expectedState);
  });

  test('setState should set secondaryField.state when secondaryFieldState is present in its argument.', () => {
    const expectedState = {
      value : "test",
      validity: Validity.VALID_FINALIZABLE,
      messages: []
    }
    field.setState({
      secondaryFieldState: expectedState 
    });
    expect(field.secondaryField.state).toStrictEqual(expectedState);
  });

  test('setState should set useSecondaryField when present in its argument.', () => {
    field.setState({
      useSecondaryField: true
    });
    expect(field.useSecondaryField).toBe(true);
  });

  test('reset should set omit to omitByDefault, call reset on both fields and set useSecondaryField to false.', () => {
    vi.spyOn(field.primaryField, 'reset');
    vi.spyOn(field.secondaryField, 'reset');
    field.omit = true;
    field.useSecondaryField = true;
    field.reset();
    expect(field.omit).toBe(false);
    expect(field.useSecondaryField).toBe(false);
    expect(field.primaryField.reset).toHaveBeenCalled();
    expect(field.secondaryField.reset).toHaveBeenCalled();
  });
});