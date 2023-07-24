import { describe, test, expect, beforeEach } from "vitest";
import { SyncSingleInputValidatorSuite } from "../../../../model/validators/single-input/sync-single-input-validator-suite";
import { SubscriptionManager } from "../../../../model/types/subscriptions/subscription-manager.interface";
import { SubscriptionManagerImpl } from "../../../../model/subscriptions/subscription-manager-impl";
import { Validity } from "../../../../model/types/state/validity.enum";
import { MessageType } from "../../../../model/types/state/messages/message-type.enum";
import { SyncValidator } from "../../../../model/types/validators/sync-validator.type";
import { ErrorMessages } from "../../../../model/constants/error-messages.enum";

describe('SyncSingleInputValidatorSuite', () => {
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
  });

  test('it immediately returns the passed value and a Validity of VALID_FINALIZABLE when no validators are passed to the constructor.', () => {
    const validatorSuite = new SyncSingleInputValidatorSuite<string>([], subscriptionManager);
    validatorSuite.evaluate('test').subscribe(next => {
      expect(next).toStrictEqual({
        value : 'test',
        validity: Validity.VALID_FINALIZABLE,
        messages: []
      });
    });
  });

  test('it should return the appropriate object when all validators pass.', () => {
    const validatorSuite = new SyncSingleInputValidatorSuite<string>([isNotEmptyStr, containsVowel], subscriptionManager);
    validatorSuite.evaluate('test').subscribe(next => {
      expect(next).toStrictEqual({
        value : 'test',
        validity: Validity.VALID_FINALIZABLE,
        messages: [
          {
            type: MessageType.VALID,
            text: "The value has a length greater than 0"
          },
          {
            type: MessageType.VALID,
            text: "The value contains a vowel"
          }
        ]
      });
    });
  });

  test('it should return the appropriate object when all validators fail.', () => {
    const validatorSuite = new SyncSingleInputValidatorSuite<string>([isNotEmptyStr, containsVowel], subscriptionManager);
    validatorSuite.evaluate('').subscribe(next => {
      expect(next).toStrictEqual({
        value : '',
        validity: Validity.INVALID,
        messages: [
          {
            type: MessageType.INVALID,
            text: "The value is an empty string."
          },
          {
            type: MessageType.INVALID,
            text: "The value does not contain a vowel"
          }
        ]
      });
    });
  });
  
  test('it should return the appropriate object when a validator throws an error.', () => {
    const validatorSuite = new SyncSingleInputValidatorSuite([throwError as SyncValidator<string>], subscriptionManager);
    validatorSuite.evaluate('test').subscribe(next => {
      expect(next).toStrictEqual({
        value: 'test',
        validity: Validity.ERROR,
        messages: [
          {
            type: MessageType.ERROR,
            text: ErrorMessages.VALIDATION_ERROR
          }
        ]
      });
    });
  });
});






function isNotEmptyStr(value : string) {
  const isValid = value.length > 0;
  return {
    isValid,
    message : isValid ? "The value has a length greater than 0" : "The value is an empty string."
  }
} 
function containsVowel(value : string) {
  const isValid = /[aeiou]/gi.test(value);
  return {
    isValid,
    message : isValid ? "The value contains a vowel" : "The value does not contain a vowel"
  }
}
function throwError(value : string) {
  throw new Error(`An unexpected error was thrown by argument '${value}'`);
}