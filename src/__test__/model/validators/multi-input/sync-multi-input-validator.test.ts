import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../../model/container';
import { MockField } from '../../../util/mocks/mock-field';
import { Validity } from '../../../../model';
import { SyncValidator } from '../../../../model/validators/sync-validator.type';
import { AggregatedStateChanges } from '../../../../model/aggregators/aggregated-state-changes.interface';
import { setNodeEnv } from '../../../util/funcs/set-node-env';

describe('SyncMultiInputValidator', () => {
  test('If there are omitted fields, calculatedValidityChanges emits Validity.VALID_FINALIZABLE.', () => {
    const fields = {
      fieldA: container.services.BaseFieldFactory.createField('', true, [], []),
      fieldB: new MockField('', Validity.INVALID),
    };

    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.calculatedValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.VALID_FINALIZABLE);
    });
  });

  test('If there are omitted fields, overallValidityChanges emits Validity.VALID_FINALIZABLE.', () => {
    const fields = {
      fieldA: container.services.BaseFieldFactory.createField('', true, [], []),
      fieldB: new MockField('', Validity.INVALID),
    };

    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.overallValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.VALID_FINALIZABLE);
    });
  });

  test('If there are omitted fields, messageChanges emits null.', () => {
    const fields = {
      fieldA: container.services.BaseFieldFactory.createField('', true, [], []),
      fieldB: new MockField('', Validity.INVALID),
    };

    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.messageChanges.subscribe(change => {
      expect(change).toBeNull();
    });
  });

  test('If there are no omitted fields, but overallValidity() is less than Validity.VALID_FINALIZABLE, calculatedValidityChanges emits Validity.VALID_FINALIZABLE.', () => {
    const fields = {
      fieldA: new MockField('', Validity.INVALID),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.calculatedValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.VALID_FINALIZABLE);
    });
  });

  test('If there are no omitted fields, but overallValidity() is less than Validity.VALID_FINALIZABLE, overallValidityChanges emits overallValidity().', () => {
    const fields = {
      fieldA: new MockField('', Validity.INVALID),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.overallValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.INVALID);
    });
  });

  test('If there are no omitted fields, but overallValidity() is less than Validity.VALID_FINALIZABLE, messageChanges emits null.', () => {
    const fields = {
      fieldA: new MockField('', Validity.INVALID),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.messageChanges.subscribe(change => {
      expect(change).toBeNull();
    });
  });

  test('When there are no omitted fields, and overallValidity is Validity.VALID_FINALIZABLE, calculatedStateChanges emits the result of the validator.', () => {
    const fields = {
      fieldA: new MockField('some value', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('some other value', Validity.VALID_FINALIZABLE),
    };

    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    let fieldBHasValue = true;

    validator.calculatedValidityChanges.subscribe(change => {
      if (fieldBHasValue) {
        expect(change).toBe(Validity.VALID_FINALIZABLE);
      } else expect(change).toBe(Validity.INVALID);
    });

    fieldBHasValue = false;

    fields.fieldB.setValue('');
  });

  test('When there are no omitted fields, and overallValidity is Validity.VALID_FINALIZABLE, overallStateChanges emits the result of the validator.', () => {
    const fields = {
      fieldA: new MockField('some value', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('some other value', Validity.VALID_FINALIZABLE),
    };

    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    let fieldBHasValue = true;

    validator.overallValidityChanges.subscribe(change => {
      if (fieldBHasValue) {
        expect(change).toBe(Validity.VALID_FINALIZABLE);
      } else expect(change).toBe(Validity.INVALID);
    });

    fieldBHasValue = false;

    fields.fieldB.setValue('');
  });

  test('When there are no omitted fields, and overallValidity is Validity.VALID_FINALIZABLE, messageChanges emits messages returned by the validator.', () => {
    const fields = {
      fieldA: new MockField('some value', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('some other value', Validity.VALID_FINALIZABLE),
    };

    const invalidMessage = 'The validator is invalid.';

    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      const isValid = fieldA.value && fieldB.value;

      return {
        isValid,
        message: isValid ? undefined : invalidMessage,
      };
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    let fieldBHasValue = true;

    validator.messageChanges.subscribe(change => {
      if (fieldBHasValue) {
        expect(change).toBe(null);
      } else expect(change?.text).toBe(invalidMessage);
    });

    fieldBHasValue = false;

    fields.fieldB.setValue('');
  });

  test('When the validator throws an error, calculatedValidityChanges emits Validity.ERROR.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw new Error('Error validating the fields.');
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.calculatedValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.ERROR);
    });
  });

  test('When the validator throws an error, overallValidityChanges emits Validity.ERROR.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw new Error('Error validating the fields.');
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.overallValidityChanges.subscribe(change => {
      expect(change).toBe(Validity.ERROR);
    });
  });

  test('When the validator throws an error, messageChanges emits an error message.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw new Error('Error validating the fields.');
    };

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.messageChanges.subscribe(change => {
      expect(change?.text).toBe(
        container.services.ConfigLoader.config.globalMessages
          .multiFieldValidationError,
      );
    });
  });

  test('When the validator throws an error, logErrorInDevMode() is called.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const expectedError = new Error('Error validating fields.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      throw expectedError;
    };

    const resetProcessDotEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error: vi.fn(),
    });

    const validator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        baseValidatorFn,
        fields,
      );

    validator.calculatedValidityChanges.subscribe(() => {
      expect(console.error).toHaveBeenCalledWith(expectedError);
      resetProcessDotEnv();
      vi.unstubAllGlobals();
    });
  });
});
