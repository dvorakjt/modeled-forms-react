import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { getTestContainer, Services } from '../../test-container';
import type { SubscriptionManager } from '../../../../model/types/subscriptions/subscription-manager.interface';
import { ManagedObservableFactory } from '../../../../model/types/subscriptions/managed-observable-factory.interface';
import { ManagedSubscriptionList } from '../../../../model/types/subscriptions/managed-subscription-list.interface';
import { SyncSingleInputValidatorSuite } from '../../../../model/validators/single-input/sync-single-input-validator-suite';
import { createInvalidSyncValidator } from './mocks/sync/create-invalid-sync-validator';
import { Validity } from '../../../../model/types/state/validity.enum';
import { MessageType } from '../../../../model/types/state/messages/message-type.enum';
import { AsyncSingleInputValidatorSuite } from '../../../../model/validators/single-input/async-single-input-validator-suite';
import { createTriggerableValidAsyncValidator } from './mocks/async/create-triggerable-valid-async-validator';
import { HybridSingleInputValidatorSuite } from '../../../../model/validators/single-input/hybrid-single-input-validator-suite';
import { Subject } from 'rxjs';
import { ErrorMessages } from '../../../../model/constants/error-messages.enum';
import { createErrantSyncValidator } from './mocks/sync/create-errant-sync-validator';
import { createValidSyncValidator } from './mocks/sync/create-valid-sync-validator';

describe('HybridSingleInputValidatorSuite', () => {
  const container = getTestContainer();
  const subscriptionManager = container.get<SubscriptionManager>(
    Services.SubscriptionManager,
  );
  const managedObservableFactory = container.get<ManagedObservableFactory>(
    Services.ManagedObservableFactory,
  );
  let managedSubscriptionList: ManagedSubscriptionList;

  beforeEach(() => {
    managedSubscriptionList = container.get<ManagedSubscriptionList>(
      Services.ManagedSubscriptionList,
    );
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });


  test('It returns only the syncResult if the resultant validity is INVALID.', () => {
    const expectedValue = 'test';
    const expectedMessage = 'invalid';
    const expectedResult = {
      syncResult : {
        value : expectedValue,
        validity : Validity.INVALID,
        messages: [
          {
            type : MessageType.INVALID,
            text : expectedMessage
          }
        ]
      }
    }
    const syncValidatorSuite = new SyncSingleInputValidatorSuite([createInvalidSyncValidator(expectedMessage)]);
    const triggerAsync = new Subject<void>();
    const asyncValidatorSuite = new AsyncSingleInputValidatorSuite(
      [
        createTriggerableValidAsyncValidator(triggerAsync, 'unreachable message')
      ],
      'pending message',
      managedObservableFactory,
      managedSubscriptionList
    );
    const hybridValidatorSuite = new HybridSingleInputValidatorSuite(syncValidatorSuite, asyncValidatorSuite);
    triggerAsync.complete();
    expect(hybridValidatorSuite.evaluate(expectedValue)).toStrictEqual(expectedResult);
  });

  test('It returns only the syncResult if the resultant validity is ERROR.', () => {
    const expectedValue = 'test';
    const expectedResult = {
      syncResult : {
        value : expectedValue,
        validity : Validity.ERROR,
        messages: [
          {
            type : MessageType.ERROR,
            text : ErrorMessages.SINGLE_INPUT_VALIDATION_ERROR
          }
        ]
      }
    }
    const syncValidatorSuite = new SyncSingleInputValidatorSuite([createErrantSyncValidator()]);
    const triggerAsync = new Subject<void>();
    const asyncValidatorSuite = new AsyncSingleInputValidatorSuite(
      [
        createTriggerableValidAsyncValidator(triggerAsync, 'unreachable message')
      ],
      'pending message',
      managedObservableFactory,
      managedSubscriptionList
    );
    const hybridValidatorSuite = new HybridSingleInputValidatorSuite(syncValidatorSuite, asyncValidatorSuite);
    triggerAsync.complete();
    expect(hybridValidatorSuite.evaluate(expectedValue)).toStrictEqual(expectedResult);
  });

  test('It returns a syncResult with a validity of PENDING and a combination of messages from both validators when the sync validators pass.', () => {
    const expectedValue = 'test';
    const validMessage = 'valid';
    const pendingMessage = 'pending';
    const expectedSyncResult = {
      value : expectedValue,
      validity : Validity.PENDING,
      messages: [
        {
          type : MessageType.VALID,
          text : validMessage
        },
        {
          type : MessageType.PENDING,
          text : pendingMessage
        }
      ]
    }
    const syncValidatorSuite = new SyncSingleInputValidatorSuite([createValidSyncValidator(validMessage)]);
    const triggerAsync = new Subject<void>();
    const asyncValidatorSuite = new AsyncSingleInputValidatorSuite(
      [
        createTriggerableValidAsyncValidator(triggerAsync, 'unreachable message')
      ],
      pendingMessage,
      managedObservableFactory,
      managedSubscriptionList
    );
    const hybridValidatorSuite = new HybridSingleInputValidatorSuite(syncValidatorSuite, asyncValidatorSuite);
    expect(hybridValidatorSuite.evaluate(expectedValue).syncResult).toStrictEqual(expectedSyncResult);
  });
});