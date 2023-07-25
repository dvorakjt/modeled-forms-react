import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { DualField } from "../../../model/types/fields/dual-field.interface";
import { Field } from "../../../model/types/fields/field.interface";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import { Adapter } from "../../../model/types/adapters/adapter.interface";
import { DualFieldSetValueArg } from "../../../model/types/state/dual-field-set-value-arg.interface";
import { SubscriptionManagerImpl } from "../../../model/subscriptions/subscription-manager-impl";
import { AdapterStub } from "../stub/adapter-stub";
import { FieldImpl } from "../../../model/fields/field-impl";
import { SyncSingleInputValidatorSuite } from "../../../model/validators/single-input/sync-single-input-validator-suite";
import { DualFieldImpl } from "../../../model/fields/dual-field-impl";
import { ValueControlledDualField } from "../../../model/fields/value-controlled-dual-field";

describe('ValueControlledDualField', () => {
  let controlledField : DualField;
  let internalField : DualField;
  let primaryField : Field;
  let secondaryField : Field;
  let subscriptionManager : SubscriptionManager;
  let adapterStub : Adapter<DualFieldSetValueArg>;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
    adapterStub = new AdapterStub<DualFieldSetValueArg>(subscriptionManager);
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
    controlledField = new ValueControlledDualField(internalField, adapterStub);
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
    controlledField.setValue({
      secondaryFieldValue : 'secondary field value'
    });
    expect(controlledField.state.value).toBe('');
    controlledField.useSecondaryField = true;
    expect(internalField.useSecondaryField).toBe(true);
    expect(controlledField.useSecondaryField).toBe(internalField.useSecondaryField);
    expect(controlledField.state.value).toBe('secondary field value');
  });
});