import { describe, test, expect, beforeEach, vi } from "vitest";
import { SubscriptionManager } from "../../../../model/types/subscriptions/subscription-manager.interface";
import { SubscriptionManagerImpl } from "../../../../model/subscriptions/subscription-manager-impl";
import { Validity } from "../../../../model/types/state/validity.enum";
import { MessageType } from "../../../../model/types/state/messages/message-type.enum";
import { ErrorMessages } from "../../../../model/constants/error-messages.enum";
import { AsyncSingleInputValidatorSuite } from "../../../../model/validators/single-input/async-single-input-validator-suite";
import { ValidatorResult } from "../../../../model/types/validators/validator-result.interface";
import { ValidatorSuiteResult } from "../../../../model/types/validators/validator-suite-result.interface";
import { AsyncValidator } from "../../../../model/types/validators/async-validator.type";
import { copyObject } from "../../../../model/util/copy-object";

describe('SyncSingleInputValidatorSuite', () => {
  let subscriptionManager : SubscriptionManager;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
  });

  test('it synchronously returns a result including a validity of PENDING before any async validators run.', () => {
    const validatorSuite = new AsyncSingleInputValidatorSuite<string>([], "Checking field", subscriptionManager);
    expect(validatorSuite.evaluate('test').syncResult).toStrictEqual({
      value: 'test',
      validity: Validity.PENDING,
      messages: [
        {
          type: MessageType.PENDING,
          text: 'Checking field'
        }
      ]
    });
  });

  test('it should return the appropriate result when all validators pass.', () => {
    const validatorSuite = new AsyncSingleInputValidatorSuite<string>([isNotEmptyStrAsync, containsVowelAsync], 'Checking field', subscriptionManager);
    let result : ValidatorSuiteResult<string>;
    validatorSuite.evaluate('test').observable?.subscribe({
      next: next => result = next,
      complete: () => {
        expect(result).toStrictEqual({
          value: 'test',
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
      }
    })
  });

  test('it should return the appropriate result when a validator fails.', () => {
    const validatorSuite = new AsyncSingleInputValidatorSuite<string>([isNotEmptyStrAsync, containsVowelAsync], 'Checking field', subscriptionManager);
    let result : ValidatorSuiteResult<string>;
    validatorSuite.evaluate('tst').observable?.subscribe({
      next: next => result = next,
      complete: () => {
        expect(result).toStrictEqual({
          value: 'tst',
          validity: Validity.INVALID,
          messages: [
            {
              type: MessageType.VALID,
              text: "The value has a length greater than 0"
            },
            {
              type: MessageType.INVALID,
              text: "The value does not contain a vowel"
            }
          ]
        });
      }
    })
  });

  test('it should return the appropriate result when a validator throws an error.', () => {
    const validatorSuite = new AsyncSingleInputValidatorSuite<string>([isNotEmptyStrAsync, containsVowelAsync, throwErrorAsync as AsyncValidator<string>], 'Checking field', subscriptionManager);
    let result : ValidatorSuiteResult<string>;
    validatorSuite.evaluate('test').observable?.subscribe({
      next: next => result = next,
      complete: () => {
        expect(result).toStrictEqual({
          value: 'test',
          validity: Validity.ERROR,
          messages: [
            {
              type: MessageType.VALID,
              text: "The value has a length greater than 0"
            },
            {
              type: MessageType.VALID,
              text: "The value contains a vowel"
            },
            {
              type: MessageType.ERROR,
              text: ErrorMessages.VALIDATION_ERROR
            }
          ]
        });
      }
    })
  });

  test('it should log an error when a validator throws an error in development mode.', () => {
    const originalProcess = copyObject(process.env);
    process.env = {
      ...process.env,
      NODE_ENV : 'development'
    }
    console.error = vi.fn();
    const validatorSuite = new AsyncSingleInputValidatorSuite<string>([throwErrorAsync as AsyncValidator<string>], 'Checking field', subscriptionManager);
    validatorSuite.evaluate('test').observable?.subscribe({
      complete: () => {
        expect(console.error).toHaveBeenCalled();
        process.env = originalProcess;
      }
    });
  });
});

function isNotEmptyStrAsync (value : string) {
  return new Promise<ValidatorResult>(resolve => {
    const isValid = value.length > 0;
    resolve({
      isValid,
      message : isValid ? "The value has a length greater than 0" : "The value is an empty string."
    });
  })
  
} 
async function containsVowelAsync(value : string) {
  const isValid = /[aeiou]/gi.test(value);
  return {
    isValid,
    message : isValid ? "The value contains a vowel" : "The value does not contain a vowel"
  }
}
function throwErrorAsync(value : string) {
  return new Promise((_resolve, reject) => {
    reject(new Error(`An unexpected error was thrown by argument '${value}'`));
  });
}