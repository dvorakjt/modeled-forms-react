import { describe, test, expect, beforeEach } from "vitest";
import { SubscriptionManager } from "../../../../model/types/subscriptions/subscription-manager.interface";
import { SubscriptionManagerImpl } from "../../../../model/subscriptions/subscription-manager-impl";
import { Validity } from "../../../../model/types/state/validity.enum";
import { MessageType } from "../../../../model/types/state/messages/message-type.enum";
import { ErrorMessages } from "../../../../model/constants/error-messages.enum";
import { AsyncSingleInputValidatorSuite } from "../../../../model/validators/single-input/async-single-input-validator-suite";
import { ValidatorResult } from "../../../../model/types/validators/validator-result.interface";
import { SyncSingleInputValidatorSuite } from "../../../../model/validators/single-input/sync-single-input-validator-suite";
import { HybridSingleInputValidatorSuite } from "../../../../model/validators/single-input/hybrid-single-input-validator-suite";
import { SyncValidator } from "../../../../model/types/validators/sync-validator.type";

describe('SyncSingleInputValidatorSuite', () => {
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
  });

  test('it does not run async validators if the sync result is INVALID.', () => {
    const syncValidatorSuite = new SyncSingleInputValidatorSuite<string>([failingSyncValidator]);
    const asyncValidatorSuite = new AsyncSingleInputValidatorSuite<string>([passingAsyncValidator], '', subscriptionManager);
    const hybridValidatorSuite = new HybridSingleInputValidatorSuite<string>(syncValidatorSuite, asyncValidatorSuite);
    expect(hybridValidatorSuite.evaluate('test')).toStrictEqual({
      syncResult: {
        value: 'test',
        validity: Validity.INVALID,
        messages: [
          {
            type: MessageType.INVALID,
            text: 'test was determined invalid synchronously.'
          }
        ]
      }
    });
  });

  test('it does not run async validators if the sync result is ERROR', () => {
    const syncValidatorSuite = new SyncSingleInputValidatorSuite<string>([throwErrorSync as SyncValidator<string>]);
    const asyncValidatorSuite = new AsyncSingleInputValidatorSuite<string>([passingAsyncValidator], '', subscriptionManager);
    const hybridValidatorSuite = new HybridSingleInputValidatorSuite<string>(syncValidatorSuite, asyncValidatorSuite);
    expect(hybridValidatorSuite.evaluate('test')).toStrictEqual({
      syncResult : {
        value: 'test',
        validity: Validity.ERROR,
        messages: [
          {
            type: MessageType.ERROR,
            text: ErrorMessages.VALIDATION_ERROR
          }
        ]
      }
    });
  });

  test('the observable returns the async result if all sync validators pass.', () => {
    const syncValidatorSuite = new SyncSingleInputValidatorSuite<string>([passingSyncValidator]);
    const asyncValidatorSuite = new AsyncSingleInputValidatorSuite<string>([passingAsyncValidator], '', subscriptionManager);
    const hybridValidatorSuite = new HybridSingleInputValidatorSuite<string>(syncValidatorSuite, asyncValidatorSuite);
    hybridValidatorSuite.evaluate('test').observable?.subscribe({
      next: next => {
        expect(next).toStrictEqual({
          value: 'test',
          validity: Validity.VALID_FINALIZABLE,
          messages: [
            {
              type: MessageType.VALID,
              text: 'test was determined valid asynchronously.'
            }
          ]
        })
      }
    })
  });
});

function passingSyncValidator(value : string) {
  return {
    isValid: true,
    message: `${value} was determined valid synchronously.`
  }
}

function failingSyncValidator(value : string) {
  return {
    isValid : false,
    message: `${value} was determined invalid synchronously.`
  }
}

function throwErrorSync(value : string) {
  throw new Error(`An unexpected error was thrown by argument '${value}'`);
}

function passingAsyncValidator(value : string) {
  return new Promise<ValidatorResult>(resolve => {
    resolve({
      isValid : true,
      message : `${value} was determined valid asynchronously.`
    });
  });
}