import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../../model/container';
import { MockField } from '../../../util/mocks/mock-field';
import { FieldState, MessageType, Validity, required } from '../../../../model';
import { Visited } from '../../../../model/state/visited.enum';
import { Modified } from '../../../../model/state/modified.enum';
import { SyncValidator } from '../../../../model/validators/sync-validator.type';
import { AggregatedStateChanges } from '../../../../model/aggregators/aggregated-state-changes.interface';
import { UserFacingMultiInputValidatedField } from '../../../../model/form-elements/multi-input-validated/user-facing-multi-input-validated-field';

describe('UserFacingMultiInputValidatedField', () => {
  test('state returns the base form element\'s value.', () => {
    const expectedValue = 'test';

    const mockField = new MockField(expectedValue, Validity.VALID_FINALIZABLE);

    const multiInputValidatedFormElements = 
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        mockField
      );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedField.state.value).toBe(expectedValue);
  });

  test('state returns the base form element\'s messages.', () => {
    const expectedMessages = [
      {
        text : 'A message',
        type : MessageType.VALID
      }
    ]

    const mockField = new MockField('', Validity.VALID_FINALIZABLE, expectedMessages);

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      mockField
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedField.state.messages).toStrictEqual(expectedMessages);
  });

  test('state returns the base form element\'s omit.', () => {
    const baseField = container.services.BaseFieldFactory.createField('', true, [], []);

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedField.state.omit).toBe(true);
  });

  test('state returns the base form element\'s visited.', () => {
    const baseField = container.services.BaseFieldFactory.createField('', false, [], []);
    baseField.setState({
      visited : Visited.YES
    });

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedField.state.visited).toBe(Visited.YES);
  });

  test('state returns the base form element\'s modified.', () => {
    const baseField = container.services.BaseFieldFactory.createField('', false, [], []);
    baseField.setState({
      modified: Modified.YES
    });

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedField.state.modified).toBe(Modified.YES);
  });

  test('state returns the minimum of the base field\'s validity and any attached validator\'s validitiy.', () => {
    const fields = {
      fieldA : container.services.BaseFieldFactory.createField('', false, [required('Field A is required')], []),
      fieldB : container.services.BaseFieldFactory.createField('', false, [], [])
    }

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      fields.fieldA
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedField.state.validity).toBe(Validity.INVALID);

    fields.fieldA.setValue('new value');

    expect(userFacingMultiInputValidatedField.state.validity).toBe(Validity.VALID_FINALIZABLE);

    const multiInputValidatorBaseFn : SyncValidator<AggregatedStateChanges> = ({fieldA, fieldB}) => {
      return {
        isValid : fieldA.value && fieldB.value
      }
    }

    const multiInputValidator = container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(multiInputValidatorBaseFn, fields);

    userFacingMultiInputValidatedField.addValidator(multiInputValidator);

    expect(userFacingMultiInputValidatedField.state.validity).toBe(Validity.INVALID);
  });

  test('omit returns the base field\'s omit.', () => {
    const baseField = container.services.BaseFieldFactory.createField('', true, [], []);

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedField.omit).toBe(true);
  });

  test('setting omit sets the base field\'s omit property.', () => {
    const baseField = new MockField('', Validity.VALID_FINALIZABLE);

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0];

    userFacingMultiInputValidatedField.omit = true;
    expect(baseField.omit).toBe(true);
  });


  test('calling setState() calls the base field\'s setState() method.', () => {
    const baseField = new MockField('', Validity.VALID_FINALIZABLE);

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedField;

    vi.spyOn(baseField, 'setState');

    const expectedState : FieldState = {
      value : 'test',
      validity : Validity.VALID_FINALIZABLE,
      messages : [
        {
          text : 'some message',
          type : MessageType.VALID
        }
      ],
      visited : Visited.YES,
      modified : Modified.YES,
      omit : false
    }

    userFacingMultiInputValidatedField.setState(expectedState);

    expect(baseField.setState).toHaveBeenCalledWith(expectedState);
  });

  test('calling setValue() calls the base field\'s setValue() method.', () => {
    const baseField = new MockField('', Validity.VALID_FINALIZABLE);

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedField;

    vi.spyOn(baseField, 'setValue');

    const expectedValue = 'test';

    userFacingMultiInputValidatedField.setValue(expectedValue);

    expect(baseField.setValue).toHaveBeenCalledWith(expectedValue);
  });

  test('calling reset() calls the base field\'s reset() method.', () => {
    const baseField = new MockField('', Validity.VALID_FINALIZABLE);

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const userFacingMultiInputValidatedField = multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedField;

    vi.spyOn(baseField, 'reset');

    userFacingMultiInputValidatedField.reset();

    expect(baseField.reset).toHaveBeenCalledOnce();
  }); 
});