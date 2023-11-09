import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../../model/container';
import { MockField } from '../../../util/mocks/mock-field';
import { MessageType, Validity } from '../../../../model';
import { AsyncValidator } from '../../../../model/validators/async-validator.type';
import { AggregatedStateChanges } from '../../../../model/aggregators/aggregated-state-changes.interface';
import { setNodeEnv } from '../../../util/funcs/set-node-env';
import { Subject } from 'rxjs';

describe('AsyncMultInputValidator', () => {
  test('If there are omitted fields, calculatedValidityChanges emits Validity.VALID_FINALIZABLE.', () => {
    const fields = {
      fieldA: container.services.BaseFieldFactory.createField('', true, [], []),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        resolve({
          isValid: false,
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.calculatedValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.VALID_FINALIZABLE);
    });
  });

  test('If there are omitted fields, overallValidityChanges emits Validity.VALID_FINALIZABLE.', () => {
    const fields = {
      fieldA: container.services.BaseFieldFactory.createField('', true, [], []),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        resolve({
          isValid: false,
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.overallValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.VALID_FINALIZABLE);
    });
  });

  test('If there are omitted fields, messageChanges emits null.', () => {
    const fields = {
      fieldA: container.services.BaseFieldFactory.createField('', true, [], []),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        resolve({
          isValid: false,
          message:
            'This message will not be emitted by messageChanges because of omitted fields.',
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.messageChanges.subscribe(change => {
      expect(change).toBeNull();
    });
  });

  test('If overallValidity() is less than Validity.VALID_FINALIZABLE, calculatedValidityChanges emits Validity.VALID_FINALIZABLE.', () => {
    const fields = {
      fieldA: new MockField('', Validity.INVALID),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        resolve({
          isValid: false,
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.calculatedValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.VALID_FINALIZABLE);
    });
  });

  test('If overallValidity() is less than Validity.VALID_FINALIZABLE, overallValidityChanges emits overallValidity().', () => {
    const fields = {
      fieldA: new MockField('', Validity.INVALID),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        resolve({
          isValid: true,
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.overallValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.INVALID);
    });
  });

  test('If overallValidity() is less than Validity.VALID_FINALIZABLE, messageChanges emits null.', () => {
    const fields = {
      fieldA: new MockField('', Validity.INVALID),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        resolve({
          isValid: true,
          message:
            'This message will not be emitted by messageChanges because overallValidity() is less than Validity.VALID_FINALIZABLE.',
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.messageChanges.subscribe(change => {
      expect(change).toBeNull();
    });
  });

  test('In development mode, if an error is thrown by the base validator function before returning a promise during the first run of the validator, console.error is called.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const expectedError = new Error('Error creating promise.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw expectedError;
    };

    const resetProcessDotEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error: vi.fn(),
    });

    container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
      mockBaseValidatorFn,
      fields,
      'validating',
    );

    expect(console.error).toHaveBeenCalledWith(expectedError);
    resetProcessDotEnv();
    vi.unstubAllGlobals();
  });

  test('If an error is thrown by the base validator function before returning a promise during the first run of the validator, calculatedValidityChanges emits Validity.ERROR.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw new Error('error creating promise');
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.calculatedValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.ERROR);
    });
  });

  test('If an error is thrown by the base validator function before returning a promise during the first run of the validator, overallValidityChanges emits Validity.ERROR.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw new Error('error creating promise');
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.overallValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.ERROR);
    });
  });

  test('If an error is thrown by the base validator function before returning a promise during the first run of the validator, messageChanges emits the default multi-input validator error message.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw new Error('error creating promise');
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.messageChanges.subscribe(change => {
      expect(change).toStrictEqual({
        text: container.services.ConfigLoader.config.globalMessages
          .multiFieldValidationError,
        type: MessageType.ERROR,
      });
    });
  });

  test('If there are no omitted fields and overallValidity() is Validity.VALID_FINALIZABLE, calculatedValidityChanges emits Validity.PENDING.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(() => {});
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.calculatedValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.PENDING);
    });
  });

  test('If there are no omitted fields and overallValidity() is Validity.VALID_FINALIZABLE, overallValidityChanges emits Validity.PENDING.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(() => {});
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    validator.overallValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.PENDING);
    });
  });

  test('If there are no omitted fields and overallValidity() is Validity.VALID_FINALIZABLE, messageChanges emits the pending message.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(() => {});
    };

    const expectedPendingMessage = 'validating';

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        expectedPendingMessage,
      );

    validator.messageChanges.subscribe(change => {
      expect(change).toStrictEqual({
        text: expectedPendingMessage,
        type: MessageType.PENDING,
      });
    });
  });

  test('During subsequent runs of the validator, console.error is called in development mode.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const expectedError = new Error('Error creating promise.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw expectedError;
    };

    container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
      mockBaseValidatorFn,
      fields,
      'validating',
    );

    const resetProcessDotEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error: vi.fn(),
    });

    //trigger second run of validator
    fields.fieldA.setValue('new value');

    expect(console.error).toHaveBeenCalledWith(expectedError);

    resetProcessDotEnv();
    vi.unstubAllGlobals();
  });

  test('During subsequent runs of the validator, if an error is thrown before the promise is returned, calculatedValidityChanges emits Validity.ERROR.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw new Error('error creating promise');
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    //trigger second run of validator
    fields.fieldA.setValue('new value');

    validator.calculatedValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.ERROR);
    });
  });

  test('During subsequent runs of the validator, if an error is thrown before the promise is returned, overallValidityChanges emits Validity.ERROR.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw new Error('error creating promise');
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    //trigger second run of validator
    fields.fieldA.setValue('new value');

    validator.overallValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.ERROR);
    });
  });

  test('During subsequent runs of the validator, if an error is thrown before the promise is returned, messageChanges emits the default multi-input validator error message.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockBaseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw new Error('error creating promise');
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        mockBaseValidatorFn,
        fields,
        'validating',
      );

    //trigger second run of validator
    fields.fieldA.setValue('new value');

    validator.messageChanges.subscribe(change => {
      expect(change).toStrictEqual({
        text: container.services.ConfigLoader.config.globalMessages
          .multiFieldValidationError,
        type: MessageType.ERROR,
      });
    });
  });

  test('When the Promise returned by the validator resolves, calculatedValidityChanges emits the result of that promise.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const trigger = {
      subject: new Subject(),
    };

    const baseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        trigger.subject.subscribe({
          complete: () => {
            trigger.subject = new Subject();
            resolve({
              isValid: fieldA.value && fieldB.value,
            });
          },
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        baseValidatorFn,
        fields,
        'validating',
      );

    fields.fieldA.setValue('new value');

    const expectedValidities = [
      Validity.PENDING,
      Validity.INVALID,
      Validity.PENDING,
      Validity.VALID_FINALIZABLE,
    ];
    let expectedValidityIndex = 0;

    validator.calculatedValidityChanges.subscribe(change => {
      expect(change).toBe(expectedValidities[expectedValidityIndex++]);

      switch (expectedValidityIndex) {
        case 2:
          fields.fieldB.setValue('new value');
          break;
        case 1:
        case 3:
          trigger.subject.complete();
          break;
      }
    });
  });

  test('When the Promise returned by the validator resolves, overallValidityChanges emits the result of that promise.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const trigger = {
      subject: new Subject(),
    };

    const baseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        trigger.subject.subscribe({
          complete: () => {
            trigger.subject = new Subject();
            resolve({
              isValid: fieldA.value && fieldB.value,
            });
          },
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        baseValidatorFn,
        fields,
        'validating',
      );

    fields.fieldA.setValue('new value');

    const expectedValidities = [
      Validity.PENDING,
      Validity.INVALID,
      Validity.PENDING,
      Validity.VALID_FINALIZABLE,
    ];
    let expectedValidityIndex = 0;

    validator.overallValidityChanges.subscribe(change => {
      expect(change).toBe(expectedValidities[expectedValidityIndex++]);

      switch (expectedValidityIndex) {
        case 2:
          fields.fieldB.setValue('new value');
          break;
        case 1:
        case 3:
          trigger.subject.complete();
          break;
      }
    });
  });

  test('When the Promise returned by the validator resolves, messageChanges emits the resultant message or null if message was undefined in the validator result (message returned when result is invalid).', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const trigger = {
      subject: new Subject(),
    };

    const expectedPendingMessage = 'validating';
    const expectedInvalidMessage = 'Field A and Field B must both have value.';

    const baseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        trigger.subject.subscribe({
          complete: () => {
            trigger.subject = new Subject();
            const isValid = fieldA.value && fieldB.value;
            resolve({
              isValid: isValid,
              message: isValid ? undefined : expectedInvalidMessage,
            });
          },
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        baseValidatorFn,
        fields,
        expectedPendingMessage,
      );

    fields.fieldA.setValue('new value');

    const expectedMessages = [
      {
        text: expectedPendingMessage,
        type: MessageType.PENDING,
      },
      {
        text: expectedInvalidMessage,
        type: MessageType.INVALID,
      },
      {
        text: expectedPendingMessage,
        type: MessageType.PENDING,
      },
      null,
    ];
    let expectedMessageIndex = 0;

    validator.messageChanges.subscribe(change => {
      expect(change).toStrictEqual(expectedMessages[expectedMessageIndex++]);

      switch (expectedMessageIndex) {
        case 2:
          fields.fieldB.setValue('new value');
          break;
        case 1:
        case 3:
          trigger.subject.complete();
          break;
      }
    });
  });

  test('When the Promise returned by the validator resolves, messageChanges emits the resultant message (message returned when result is valid).', () => {
    const fields = {
      fieldA: new MockField('some value', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const trigger = new Subject();

    const expectedPendingMessage = 'validating';
    const expectedValidMessage = 'Field A and Field B both have values.';

    const baseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        trigger.subscribe({
          complete: () => {
            const isValid = fieldA.value && fieldB.value;
            resolve({
              isValid: isValid,
              message: isValid
                ? expectedValidMessage
                : 'Field A and Field B must both have values.',
            });
          },
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        baseValidatorFn,
        fields,
        expectedPendingMessage,
      );

    fields.fieldB.setValue('new value');

    const expectedMessages = [
      {
        text: expectedPendingMessage,
        type: MessageType.PENDING,
      },
      {
        text: expectedValidMessage,
        type: MessageType.VALID,
      },
    ];
    let expectedMessageIndex = 0;

    validator.messageChanges.subscribe(change => {
      expect(change).toStrictEqual(expectedMessages[expectedMessageIndex++]);

      if (expectedMessageIndex === 1) trigger.complete();
    });
  });

  test('When the promise is rejected and process.env.NODE_ENV is "development", console.error is called.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const trigger = new Subject();
    const expectedError = new Error('Error thrown inside promise.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise((_resolve, reject) => {
        trigger.subscribe({
          complete: () => {
            reject(expectedError);
          },
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        baseValidatorFn,
        fields,
        'validating',
      );

    fields.fieldA.setValue('new value');

    const resetProcessDotEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error: vi.fn(),
    });

    trigger.complete();

    validator.calculatedValidityChanges.subscribe(change => {
      if (change === Validity.ERROR) {
        expect(console.error).toHaveBeenCalledWith(expectedError);
        resetProcessDotEnv();
        vi.unstubAllGlobals();
      }
    });
  });

  test('When the promise is rejected, calculatedValidityChanges emits Validity.ERROR.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const trigger = new Subject();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise((_resolve, reject) => {
        trigger.subscribe({
          complete: () => {
            reject(new Error('Error thrown inside promise.'));
          },
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        baseValidatorFn,
        fields,
        'validating',
      );

    fields.fieldA.setValue('new value');

    trigger.complete();

    validator.calculatedValidityChanges.subscribe(change => {
      if (change === Validity.PENDING) trigger.complete();
      else expect(change).toBe(Validity.ERROR);
    });
  });

  test('When the promise is rejected, overallValidityChanges emits Validity.ERROR.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const trigger = new Subject();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise((_resolve, reject) => {
        trigger.subscribe({
          complete: () => {
            reject(new Error('Error thrown inside promise.'));
          },
        });
      });
    };

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        baseValidatorFn,
        fields,
        'validating',
      );

    fields.fieldA.setValue('new value');

    trigger.complete();

    validator.overallValidityChanges.subscribe(change => {
      if (change === Validity.PENDING) trigger.complete();
      else expect(change).toBe(Validity.ERROR);
    });
  });

  test('When the promise is rejected, messageChanges emits the default MultiInputValidator error message.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const trigger = new Subject();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise((_resolve, reject) => {
        trigger.subscribe({
          complete: () => {
            reject(new Error('Error thrown inside promise.'));
          },
        });
      });
    };

    const expectedPendingMessage = 'validating';

    const validator =
      container.services.MultiInputValidatorFactory.createAsyncMultiInputValidator(
        baseValidatorFn,
        fields,
        expectedPendingMessage,
      );

    fields.fieldA.setValue('new value');

    const expectedMessages = [
      {
        text: expectedPendingMessage,
        type: MessageType.PENDING,
      },
      {
        text: container.services.ConfigLoader.config.globalMessages
          .multiFieldValidationError,
        type: MessageType.ERROR,
      },
    ];

    let expectedMessageIndex = 0;

    validator.messageChanges.subscribe(change => {
      expect(change).toStrictEqual(expectedMessages[expectedMessageIndex++]);

      if (expectedMessageIndex === 1) trigger.complete();
    });
  });
});
