import { describe, test, expect, beforeEach, vi } from 'vitest';
import { MockConfigLoader } from '../../../util/mocks/mock-config-loader';
import { AutoTransformerImpl } from '../../../../model/auto-transforms/auto-transformer-impl';
import { MockField } from '../../../util/mocks/mock-field';
import { AutoTransformedField } from '../../../../model/fields/auto-transformed/auto-transformed-field';
import { AutoTransformedFieldFactoryImpl } from '../../../../model/fields/auto-transformed/auto-transformed-field-factory-impl';
import { FieldState, Validity } from '../../../../model';
import { Visited } from '../../../../model/state/visited.enum';
import { Modified } from '../../../../model/state/modified-enum';

describe('AutoTransformedField', () => {
  const mockConfigLoader = new MockConfigLoader({ autoTrim : true});
  const autoTransformer = new AutoTransformerImpl(mockConfigLoader);
  const autoTransformedFieldFactory = new AutoTransformedFieldFactoryImpl(autoTransformer);
  let baseField : MockField;
  let autoTransformedField : AutoTransformedField;

  beforeEach(() => {
    baseField = new MockField('', Validity.VALID_FINALIZABLE);
    autoTransformedField = autoTransformedFieldFactory.createAutoTransformedField(baseField);
  });

  test('It returns applies auto-transformations to the the base field\'s value when state is accessed.', () => {
    baseField.setValue('   hello world   ');
    expect(autoTransformedField.state.value).toBe('hello world');
  });

  test('It publishes updates to subscribers when the base field\'s state changes.', () => {
    baseField.setValue('   hello world   ');
    autoTransformedField.stateChanges.subscribe(change => {
      expect(change.value).toBe('hello world');
    });
  });

  test('It returns the base field\'s omit property when omit is accessed.', () => {
    baseField.omit = true;
    expect(autoTransformedField.omit).toBe(true);
  });

  test('It sets the base field\'s omit property when omit is set.', () => {
    autoTransformedField.omit = true;
    expect(baseField.omit).toBe(true);
  });

  test('It calls setState() on the base field when its own setState() method is called.', () => {
    const expectedState : FieldState = {
      value : 'hello world',
      validity : Validity.VALID_FINALIZABLE,
      messages : [],
      visited : Visited.YES,
      modified : Modified.YES
    }
    vi.spyOn(baseField, 'setState');
    autoTransformedField.setState(expectedState);
    expect(baseField.setState).toHaveBeenCalledWith(expectedState);
  });

  test('It calls setValue() on the base field when its own setValue() method is called.', () => {
    const expectedValue = 'hello world';
    vi.spyOn(baseField, 'setValue');
    autoTransformedField.setValue(expectedValue);
    expect(baseField.setValue).toHaveBeenCalledWith(expectedValue);
  });

  test('It calls reset() on the base field when its own reset() method is called.', () => {
    vi.spyOn(baseField, 'reset');
    autoTransformedField.reset();
    expect(baseField.reset).toHaveBeenCalled();
  });
});