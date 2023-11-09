import { describe, test, expect, beforeEach } from 'vitest';
import { MultiInputValidatorFactoryImpl } from '../../../../model/validators/multi-input/multi-input-validator-factory-impl';
import { container } from '../../../../model/container';
import { MultiInputValidatorFactory } from '../../../../model/validators/multi-input/multi-input-validator-factory.interface';
import { MockField } from '../../../util/mocks/mock-field';
import { Validity } from '../../../../model';
import { SyncValidator } from '../../../../model/validators/sync-validator.type';
import { AggregatedStateChanges } from '../../../../model/aggregators/aggregated-state-changes.interface';
import { SyncMultiInputValidator } from '../../../../model/validators/multi-input/sync-multi-input-validator';
import { FormElementDictionary } from '../../../../model/form-elements/form-element-dictionary.type';
import { AsyncValidator } from '../../../../model/validators/async-validator.type';
import { AsyncMultiInputValidator } from '../../../../model/validators/multi-input/async-multi-input-validator';

describe('MultInputValidatorFactoryImpl', () => {
  let multiInputValidatorFactory: MultiInputValidatorFactory;
  let fields: FormElementDictionary;

  beforeEach(() => {
    multiInputValidatorFactory = new MultiInputValidatorFactoryImpl(
      container.services.AggregatorFactory,
    );
    fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
    };
  });

  test('createSyncMultiInputValidator() returns an instance of SyncMultiInputValidator.', () => {
    const baseValidatorFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const validator = multiInputValidatorFactory.createSyncMultiInputValidator(
      baseValidatorFn,
      fields,
    );

    expect(validator).toBeInstanceOf(SyncMultiInputValidator);
  });

  test('createAsyncMultiInputValidator() returns an instance of AsyncMultiInputValidator.', () => {
    const baseValidatorFn: AsyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return new Promise(resolve => {
        resolve(fieldA.value && fieldB.value);
      });
    };

    const validator = multiInputValidatorFactory.createAsyncMultiInputValidator(
      baseValidatorFn,
      fields,
      'validating...',
    );

    expect(validator).toBeInstanceOf(AsyncMultiInputValidator);
  });
});
