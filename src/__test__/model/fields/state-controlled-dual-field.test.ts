import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { DualField } from "../../../model/types/fields/dual-field.interface";
import { Field } from "../../../model/types/fields/field.interface";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import { Adapter } from "../../../model/types/adapters/adapter.interface";
import { SubscriptionManagerImpl } from "../../../model/subscriptions/subscription-manager-impl";
import { AdapterStub } from "../stub/adapter-stub";
import { FieldImpl } from "../../../model/fields/field-impl";
import { SyncSingleInputValidatorSuite } from "../../../model/validators/single-input/sync-single-input-validator-suite";
import { DualFieldImpl } from "../../../model/fields/dual-field-impl";
import { StateControlledDualField } from "../../../model/fields/state-controlled-dual-field";
import { DualFieldSetStateArg } from "../../../model/types/state/dual-field-set-state-arg.interface";
import { Validity } from "../../../model/types/state/validity.enum";
import { MessageType } from "../../../model/types/state/messages/message-type.enum";

describe('StateControlledDualField', () => {
  let controlledField : DualField;
  let internalField : DualField;
  let primaryField : Field;
  let secondaryField : Field;
  let subscriptionManager : SubscriptionManager;
  let adapterStub : Adapter<DualFieldSetStateArg>;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
    adapterStub = new AdapterStub<DualFieldSetStateArg>(subscriptionManager);
    primaryField = new FieldImpl (
      new SyncSingleInputValidatorSuite<string>([]),
      '',
      subscriptionManager,
      false
    );
    secondaryField = new FieldImpl (
      new SyncSingleInputValidatorSuite<string>([]),
      '',
      subscriptionManager,
      false
    );
    internalField = new DualFieldImpl(primaryField, secondaryField, subscriptionManager, false);
    controlledField = new StateControlledDualField(internalField, adapterStub);
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('get primaryField should return internalField.primaryField', () => {
    expect(controlledField.primaryField).toBe(internalField.primaryField);
  });

  test('get secondaryField should return internalField.secondaryField', () => {
    expect(controlledField.secondaryField).toBe(internalField.secondaryField);
  });

  test('setting useSecondaryField should set the same property on internalField.', () => {
    const primaryFieldState = {
      value : '',
      validity : Validity.VALID_FINALIZABLE,
      messages: [],
    }
    const secondaryFieldState = {
      value : 'secondary field state',
      validity : Validity.PENDING,
      messages: [
        {
          type: MessageType.PENDING,
          text: 'test message'
        }
      ]
    }
    const expectedPrimaryFieldState = {
      ...primaryFieldState,
      omit : false,
      useSecondaryField : false
    }
    const expectedSecondaryFieldState = {
      ...secondaryFieldState,
      omit : false,
      useSecondaryField : true
    }
    controlledField.setState({
      secondaryFieldState : secondaryFieldState
    });
    expect(controlledField.state).toStrictEqual(expectedPrimaryFieldState);
    controlledField.useSecondaryField = true;
    expect(internalField.useSecondaryField).toBe(true);
    expect(controlledField.useSecondaryField).toBe(internalField.useSecondaryField);
    expect(controlledField.state).toStrictEqual(expectedSecondaryFieldState);
  });
});