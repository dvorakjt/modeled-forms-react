import { describe, test, expect, vi } from 'vitest';
import { SyncSingleInputValidatorSuite } from '../../../../model/validators/single-input/sync-single-input-validator-suite';
import { Validity } from '../../../../model/state/validity.enum';
import { createValidSyncValidator } from './mocks/sync/create-valid-sync-validator';
import { createInvalidSyncValidator } from './mocks/sync/create-invalid-sync-validator';
import { createErrantSyncValidator } from './mocks/sync/create-errant-sync-validator';
import { MessageType } from '../../../../model/state/messages/message-type.enum';
import { setNodeEnv } from '../../../util/funcs/set-node-env';
import { container } from '../../../../model/container';

describe('SyncSingleInputValidatorSuite', () => {
  test('When evaluate() is called and no validators were passed in to the constructor, the object is returns has a property syncResult.validity which equals Validity.VALID_FINALIZABLE.', () => {
    const validatorSuite = new SyncSingleInputValidatorSuite<string>([], container.services.ConfigLoader.config);
    expect(validatorSuite.evaluate('').syncResult.validity).toBe(
      Validity.VALID_FINALIZABLE,
    );
  });

  test('When evaluate() is called and all validators pass, the object it returns has a property syncResult.validity which equals Validity.VALID_FINALIZABLE.', () => {
    const validatorSuite = new SyncSingleInputValidatorSuite<string>([
      createValidSyncValidator(),
      createValidSyncValidator(),
      createValidSyncValidator(),
    ], container.services.ConfigLoader.config);
    expect(validatorSuite.evaluate('').syncResult.validity).toBe(
      Validity.VALID_FINALIZABLE,
    );
  });

  test('When evaluate() is called and any validator fails, the object it returns has a property syncResult.validity which equals Validity.INVALID.', () => {
    const validatorSuite = new SyncSingleInputValidatorSuite([
      createValidSyncValidator(),
      createInvalidSyncValidator(),
      createValidSyncValidator(),
    ], container.services.ConfigLoader.config);
    expect(validatorSuite.evaluate('').syncResult.validity).toBe(
      Validity.INVALID,
    );
  });

  test('When evaluate() is called and any validator throws an error, the object it returns has a property syncResult.validity which equals Validity.ERROR.', () => {
    const validatorSuite = new SyncSingleInputValidatorSuite([
      createValidSyncValidator(),
      createInvalidSyncValidator(),
      createErrantSyncValidator(),
      createInvalidSyncValidator(),
    ], container.services.ConfigLoader.config);
    expect(validatorSuite.evaluate('').syncResult.validity).toBe(
      Validity.ERROR,
    );
  });

  test('When evaluate() is called and any validator throws an error, remaining validators do not run.', () => {
    const notCalled = vi.fn(createValidSyncValidator());
    const validatorSuite = new SyncSingleInputValidatorSuite([
      createValidSyncValidator(),
      createErrantSyncValidator(),
      notCalled,
    ], container.services.ConfigLoader.config);
    validatorSuite.evaluate('');

    expect(notCalled).not.toHaveBeenCalled();
  });

  test('The messages property contains an array of message objects with text set by each validator, and a type property corresponding to the result of the validator.', () => {
    const expectedMessages = [
      {
        text: 'valid message',
        type: MessageType.VALID,
      },
      {
        text: 'invalid message',
        type: MessageType.INVALID,
      },
      {
        text: container.services.ConfigLoader.config.globalMessages.singleFieldValidationError,
        type: MessageType.ERROR,
      },
    ];
    const validatorSuite = new SyncSingleInputValidatorSuite([
      createValidSyncValidator(expectedMessages[0].text),
      createInvalidSyncValidator(expectedMessages[1].text),
      createErrantSyncValidator(),
      createValidSyncValidator('unreachable message'),
    ], container.services.ConfigLoader.config);
    expect(validatorSuite.evaluate('').syncResult.messages).toStrictEqual(
      expectedMessages,
    );
  });

  test("It logs errors when process.env.NODE_ENV is set to 'development.'", () => {
    const resetProcessDotEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error: vi.fn(),
    });
    const error = new Error();
    const validatorSuite = new SyncSingleInputValidatorSuite([
      createErrantSyncValidator(error),
    ], container.services.ConfigLoader.config);
    validatorSuite.evaluate('');
    expect(console.error).toBeCalledWith(error);
    vi.unstubAllGlobals();
    resetProcessDotEnv();
  });
});
