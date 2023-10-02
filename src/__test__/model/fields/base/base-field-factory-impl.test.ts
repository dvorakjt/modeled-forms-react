import { describe, test, expect } from 'vitest';
import { BaseFieldFactoryImpl } from '../../../../model/fields/base/base-field-factory-impl';
import { container } from '../../../../model/container';
import { AbstractField } from '../../../../model/fields/base/abstract-field';
import { SyncValidator } from '../../../../model/validators/sync-validator.type';
import { AsyncValidator } from '../../../../model/validators/async-validator.type';
import { AbstractDualField } from '../../../../model/fields/base/abstract-dual-field';

describe('BaseFieldFactoryImpl', () => {
  const baseFieldFactory = new BaseFieldFactoryImpl(container.services.SingleInputValidatorSuiteFactory);
  const mockSyncValidators : Array<SyncValidator<string>> = [
    () => ({ isValid : true })
  ]
  const mockAsyncValidators : Array<AsyncValidator<string>> = [
    () => {
      return new Promise(resolve => {
        resolve({
          isValid : true
        });
      })
    }
  ]

  test('It instantiates an AbstractField when createField() is called.', () => {
    const field = baseFieldFactory.createField('', false, mockSyncValidators, mockAsyncValidators, 'test message');
    expect(field).toBeInstanceOf(AbstractField);
  });

  test('It instantiates an AbstractDualField when createDualField() is called.', () => {
    const field = baseFieldFactory.createDualField('', '', false, mockSyncValidators, mockAsyncValidators, 'test message');
    expect(field).toBeInstanceOf(AbstractDualField);
  });
});