import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { SimpleField } from "../../../model/fields/simple-field";
import { SubscriptionManagerImpl } from "../../../model/subscriptions/subscription-manager-impl";
import { SyncSingleInputValidatorSuiteStub } from "../stub/sync-single-input-validator-suite.stub";
import { Validity } from "../../../model/types/state/validity.enum";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import { AsyncSingleInputValidatorSuite } from "../../../model/validators/single-input/async-single-input-validator-suite";
import { ManagedSubject } from "../../../model/subscriptions/managed-subject";
import { Subject } from "rxjs";
import { ValidatorResult } from "../../../model/types/validators/validator-result.interface";
import { MessageType } from "../../../model/types/state/messages/message-type.enum";

describe('SimpleField', () => {
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('setting omit should update field.omit', () => {
    const syncValidatorSuite = new SyncSingleInputValidatorSuiteStub<string>(
      subscriptionManager,
      {
        value : "",
        validity: Validity.VALID_FINALIZABLE,
        messages: []
      }
    );
    const field = new SimpleField(syncValidatorSuite, "", subscriptionManager, false);
    field.omit = true;
    expect(field.omit).toBe(true);
  });

  test('calling reset should set omit and call setValue with the default value.', () => {
    const syncValidatorSuite = new SyncSingleInputValidatorSuiteStub<string>(
      subscriptionManager,
      {
        value : "",
        validity: Validity.VALID_FINALIZABLE,
        messages: []
      }
    );
    const field = new SimpleField(syncValidatorSuite, "", subscriptionManager, false);
    field.setValue("some new value");
    field.omit = true;
    field.reset();
    expect(field.omit).toBe(false);
    expect(field.state.value).toBe("");
  });

  test('handleValidityObservable should appropriately manage asyncValidatorSuite results.', () => {
    const trigger = subscriptionManager.registerSubject(new Subject<void>());
    const asyncValidatorSuite = new AsyncSingleInputValidatorSuite([triggerablePassingAsyncValidator(trigger)], 'Checking field', subscriptionManager);
    const field = new SimpleField(asyncValidatorSuite, '', subscriptionManager, false);
    expect(field.state).toStrictEqual({
      value: '',
      validity: Validity.PENDING,
      messages: [
        {
          type: MessageType.PENDING,
          text: 'Checking field'
        }
      ],
      omit : false
    });
    let count = 0;
    field.stateChanges.subscribe(() => {
      count++;
      if(count === 2) {
        expect(field.state).toStrictEqual({
          value: '',
          validity: Validity.VALID_FINALIZABLE,
          messages: [
            {
              type: MessageType.VALID,
              text: ' was determined valid asynchronously.'
            }
          ],
          omit : false
        });
      }
    });
    trigger.complete();
  });

  test('setValue should appropriately set value based on ValidatorSuiteResultObject.syncResult and ValidatorSuiteResultObject.observable.', () => {
    const trigger = subscriptionManager.registerSubject(new Subject<void>());
    const asyncValidatorSuite = new AsyncSingleInputValidatorSuite([triggerablePassingAsyncValidator(trigger)], 'Checking field', subscriptionManager);
    const field = new SimpleField(asyncValidatorSuite, '', subscriptionManager, false);
    field.setValue('test');
    expect(field.state).toStrictEqual({
      value: 'test',
      validity: Validity.PENDING,
      messages: [
        {
          type: MessageType.PENDING,
          text: 'Checking field'
        }
      ],
      omit : false
    });
    let count = 0;
    field.stateChanges.subscribe(() => {
      count++;
      if(count === 2) {
        expect(field.state).toStrictEqual({
          value: 'test',
          validity: Validity.VALID_FINALIZABLE,
          messages: [
            {
              type: MessageType.VALID,
              text: 'test was determined valid asynchronously.'
            }
          ],
          omit : false
        });
      }
    });
    trigger.complete();
  });
});

function triggerablePassingAsyncValidator(subject : ManagedSubject<void>) {
  return function (value : string) {
    return new Promise<ValidatorResult>(resolve => {
      subject.subscribe({
        complete : () =>  {
          resolve({
            isValid : true,
            message : `${value} was determined valid asynchronously.`
          });
        }
      });
    });
  }
}