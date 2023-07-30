import { describe, test, beforeEach, expect, vi, afterEach } from 'vitest';
import { Subject } from 'rxjs';
import { getTestContainer, Services } from '../../test-container';
import { AsyncSingleInputValidatorSuite } from '../../../../model/validators/single-input/async-single-input-validator-suite';
import { Validity } from '../../../../model/types/state/validity.enum';
import { untriggerableAsyncValidator } from './mocks/async/untriggerable-async-validator';
import { MessageType } from '../../../../model/types/state/messages/message-type.enum';
import { createTriggerableValidAsyncValidator } from './mocks/async/create-triggerable-valid-async-validator';
import { ValidatorSuiteResult } from '../../../../model/types/validators/validator-suite-result.interface';
import { createTriggerableInvalidAsyncValidator } from './mocks/async/create-triggerable-invalid-async-validator';
import { ErrorMessages } from '../../../../model/constants/error-messages.enum';
import { createTriggerablePromiseRejectingAsyncValidator } from './mocks/async/create-triggerable-promise-rejecting-async-validator';
import { createIntraPromiseErrorThrowingAsyncValidator } from './mocks/async/create-intra-promise-error-throwing-async-validator';
import { createImmediateErrorThrowingAsyncValidator } from './mocks/async/create-immediate-error-throwing-async-validator';
import { setNodeEnv } from '../../../util/set-node-env';
import type { ManagedObservableFactory } from '../../../../model/types/subscriptions/managed-observable-factory.interface';
import type { SubscriptionManager } from '../../../../model/types/subscriptions/subscription-manager.interface';
import type { ManagedSubscriptionList } from '../../../../model/types/subscriptions/managed-subscription-list.interface';

describe('AsyncSingleInputValidatorSuite', () => {
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

  test('It immediately returns a result object when evaluate is called.', () => {
    const expectedValue = 'test';
    const expectedMessage = 'checking field';
    const expectedSyncResult = {
      value: expectedValue,
      validity: Validity.PENDING,
      messages: [
        {
          type: MessageType.PENDING,
          text: expectedMessage,
        },
      ],
    };
    const validatorSuite = new AsyncSingleInputValidatorSuite<string>(
      [untriggerableAsyncValidator],
      expectedMessage,
      managedObservableFactory,
      managedSubscriptionList,
    );
    expect(validatorSuite.evaluate(expectedValue).syncResult).toStrictEqual(
      expectedSyncResult,
    );
  });

  test("When evaluate is called, subscribers to the returned observable are notified of the suite's result when all validators pass.", () => {
    const expectedValue = 'test';
    const expectedResult = {
      value: expectedValue,
      validity: Validity.VALID_FINALIZABLE,
      messages: [],
    };
    const trigger1 = new Subject<void>();
    const trigger2 = new Subject<void>();
    const trigger3 = new Subject<void>();

    const validatorSuite = new AsyncSingleInputValidatorSuite<string>(
      [
        createTriggerableValidAsyncValidator(trigger1),
        createTriggerableValidAsyncValidator(trigger2),
        createTriggerableValidAsyncValidator(trigger3),
      ],
      'pending message',
      managedObservableFactory,
      managedSubscriptionList,
    );
    validatorSuite
      .evaluate(expectedValue)
      .observable?.subscribe((next: ValidatorSuiteResult<string>) => {
        expect(next).toStrictEqual(expectedResult);
      });
    trigger1.complete();
    trigger2.complete();
    trigger3.complete();
  });

  test("When evaluate() is called, and one result is invalid, the messages from previously returned valid validators are returned together with the invalid result's message, and a validity of INVALID.", () => {
    const expectedValue = 'test';
    const expectedValidMessage = 'valid message';
    const expectedInvalidMessage = 'invalid message';
    const expectedResult = {
      value: expectedValue,
      validity: Validity.INVALID,
      messages: [
        {
          text: expectedValidMessage,
          type: MessageType.VALID,
        },
        {
          text: expectedInvalidMessage,
          type: MessageType.INVALID,
        },
      ],
    };
    const triggerValid = new Subject<void>();
    const triggerInvalid = new Subject<void>();
    const validatorSuite = new AsyncSingleInputValidatorSuite(
      [
        createTriggerableValidAsyncValidator(triggerValid, expectedValidMessage),
        createTriggerableInvalidAsyncValidator(
          triggerInvalid,
          expectedInvalidMessage
        ),
        createTriggerableValidAsyncValidator(
          new Subject<void>(),
          'unreachable message',
        ),
      ],
      'pending message',
      managedObservableFactory,
      managedSubscriptionList,
    );
    validatorSuite
      .evaluate('test')
      .observable?.subscribe((next: ValidatorSuiteResult<string>) => {
        expect(next).toStrictEqual(expectedResult);
      });
    triggerValid.complete();
    triggerInvalid.complete();
  });

  test("When evaluate() is called, and the Promise is rejected, the messages from previously returned valid validators are returned together with the errant result's message, and a validity of ERROR.", () => {
    const expectedValue = 'test';
    const expectedValidMessage = 'valid message';
    const expectedError = new Error();
    const expectedResult = {
      value: expectedValue,
      validity: Validity.ERROR,
      messages: [
        {
          text: expectedValidMessage,
          type: MessageType.VALID,
        },
        {
          text: ErrorMessages.VALIDATION_ERROR,
          type: MessageType.ERROR,
        },
      ],
    };
    const triggerValid = new Subject<void>();
    const triggerPromiseRejection = new Subject<void>();
    const validatorSuite = new AsyncSingleInputValidatorSuite(
      [
        createTriggerableValidAsyncValidator(triggerValid, expectedValidMessage),
        createTriggerablePromiseRejectingAsyncValidator(triggerPromiseRejection, expectedError),
        createTriggerableValidAsyncValidator(
          new Subject<void>(),
          'unreachable message',
        ),
      ],
      'pending message',
      managedObservableFactory,
      managedSubscriptionList,
    );
    validatorSuite
      .evaluate('test')
      .observable?.subscribe((next: ValidatorSuiteResult<string>) => {
        expect(next).toStrictEqual(expectedResult);
      });
    triggerValid.complete();
    triggerPromiseRejection.complete();
  });

  test("When evaluate() is called, and an error is thrown outside the Promise, the messages from previously returned valid validators are returned together with the errant result's message, and a validity of ERROR.", () => {
    const expectedValue = 'test';
    const expectedValidMessage = 'valid message';
    const expectedError = new Error();
    const expectedResult = {
      value: expectedValue,
      validity: Validity.ERROR,
      messages: [
        {
          text: expectedValidMessage,
          type: MessageType.VALID,
        },
        {
          text: ErrorMessages.VALIDATION_ERROR,
          type: MessageType.ERROR,
        },
      ],
    };
    const triggerValid = new Subject<void>();
    const validatorSuite = new AsyncSingleInputValidatorSuite(
      [
        createTriggerableValidAsyncValidator(triggerValid, expectedValidMessage),
        createIntraPromiseErrorThrowingAsyncValidator(expectedError),
        createTriggerableValidAsyncValidator(
          new Subject<void>(),
          'unreachable message',
        ),
      ],
      'pending message',
      managedObservableFactory,
      managedSubscriptionList,
    );
    triggerValid.complete();
    validatorSuite
      .evaluate('test')
      .observable?.subscribe((next: ValidatorSuiteResult<string>) => {
        expect(next).toStrictEqual(expectedResult);
      });
  });

  test("When evaluate() is called, and an error is inside the function that returns the promise, only the error message is returned, together with a validity of ERROR.", () => {
    const expectedValue = 'test';
    const unreachableMessage = 'valid message';
    const expectedError = new Error();
    const expectedResult = {
      value: expectedValue,
      validity: Validity.ERROR,
      messages: [
        {
          text: ErrorMessages.VALIDATION_ERROR,
          type: MessageType.ERROR,
        },
      ],
    };
    const triggerAllValid = new Subject<void>();
    const validatorSuite = new AsyncSingleInputValidatorSuite(
      [
        createTriggerableValidAsyncValidator(triggerAllValid, unreachableMessage),
        createTriggerableValidAsyncValidator(triggerAllValid, unreachableMessage),
        createImmediateErrorThrowingAsyncValidator(expectedError),
      ],
      'pending message',
      managedObservableFactory,
      managedSubscriptionList,
    );
    triggerAllValid.complete();
    validatorSuite
      .evaluate('test')
      .observable?.subscribe((next: ValidatorSuiteResult<string>) => {
        expect(next).toStrictEqual(expectedResult);
      });
  });

  test("When evaluate() is called, and an error is observed while in development mode, it is logged to the console.", () => {
    const resetProcessDotEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error: vi.fn(),
    });
    const expectedError = new Error();
    const validatorSuite = new AsyncSingleInputValidatorSuite(
      [
        createImmediateErrorThrowingAsyncValidator(expectedError),
      ],
      'pending message',
      managedObservableFactory,
      managedSubscriptionList,
    );
    validatorSuite
      .evaluate('test')
      .observable?.subscribe(() => {
        expect(console.error).toHaveBeenCalledWith(expectedError);
        resetProcessDotEnv();
        vi.unstubAllGlobals();
      });
  });


  test('When evaluate() is called, and one result is invalid, remaining operations will be unsubscribed from.', () => {
    const trigger = new Subject<void>();
    const validatorSuite = new AsyncSingleInputValidatorSuite<string>(
      [
        createTriggerableInvalidAsyncValidator(trigger),
        untriggerableAsyncValidator,
        untriggerableAsyncValidator,
      ],
      'pending message',
      managedObservableFactory,
      managedSubscriptionList,
    );
    validatorSuite.evaluate('test').observable?.subscribe({
      complete: () => {
        expect(managedSubscriptionList.size).toBe(0);
      },
    });
    expect(managedSubscriptionList.size).toBe(3);
    trigger.complete();
  });
});
