import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { FieldImpl } from "../../../model/fields/field-impl";
import { AdapterStub } from "../stub/adapter-stub";
import { ValueControlledField } from "../../../model/fields/value-controlled-field";
import { SyncSingleInputValidatorSuite } from "../../../model/validators/single-input/sync-single-input-validator-suite";
import { SubscriptionManagerImpl } from "../../../model/subscriptions/subscription-manager-impl";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import { Adapter } from "../../../model/types/adapters/adapter.interface";
import { Field } from "../../../model/types/fields/field.interface";
import { Validity } from "../../../model/types/state/validity.enum";
import { MessageType } from "../../../model/types/state/messages/message-type.enum";
import { ErrorMessages } from "../../../model/constants/error-messages.enum";

describe('ValueControlledField', () => {
  let controlledField : Field;
  let internalField : Field;
  let subscriptionManager : SubscriptionManager;
  let adapterStub : Adapter<string>;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
    adapterStub = new AdapterStub<string>(subscriptionManager);
    internalField = new FieldImpl (
      new SyncSingleInputValidatorSuite<string>([]),
      '',
      subscriptionManager,
      false
    );
    controlledField = new ValueControlledField(
      internalField,
      adapterStub
    )
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('controlledField.field.state updates when setValue is called.', () => {
    controlledField.setValue('test');
    expect(controlledField.state).toStrictEqual({
      value: 'test',
      validity : Validity.VALID_FINALIZABLE,
      messages: [],
      omit : false
    });
  });

  test('controlledField.field.state updates when setState is called.', () => {
    const expectedState = {
      value: 'test',
      validity : Validity.PENDING,
      messages: [
        {
          type: MessageType.PENDING,
          text: 'test message'
        }
      ]
    }
    controlledField.setState(expectedState);
    expect(controlledField.state).toStrictEqual(expectedState);
  });

  test('reset() should call controlledField.field.reset().', () => {
    vi.spyOn(internalField, 'reset');
    controlledField.reset();
    expect(internalField.reset).toHaveBeenCalled();
  });

  test('when controlledField.adapter emits a new value, state should update.', () => {
    adapterStub.stream.next('new value');
    controlledField.stateChanges.subscribe(stateChange => {
      expect(stateChange).toStrictEqual({
        value : 'new value',
        validity : Validity.VALID_FINALIZABLE,
        messages: [],
        omit : false
      });
    });
  });

  test('when controlledField.adapter emits an error, state should update.', () => {
    adapterStub.stream.error('Adapter stream error');
    controlledField.stateChanges.subscribe(stateChange => {
      expect(stateChange).toStrictEqual({
        value : '',
        validity : Validity.ERROR,
        messages: [
          {
            type : MessageType.ERROR,
            text : ErrorMessages.FIELD_ADAPTER_ERROR
          }
        ]
      })
    });
  });

  test('setting omit should update controlledField.field.omit', () => {
    controlledField.omit = true;
    expect(internalField.omit).toBe(true);
  });

  test('getting omit should return controlledField.field.omit', () => {
    internalField.omit = true;
    expect(controlledField.omit).toBe(true);
  });
});