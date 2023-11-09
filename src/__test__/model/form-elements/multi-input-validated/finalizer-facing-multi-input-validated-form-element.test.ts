import { describe, test, expect } from 'vitest';
import { container } from '../../../../model/container';
import { MockField } from '../../../util/mocks/mock-field';
import { MessageType, Validity, required } from '../../../../model';
import { Visited } from '../../../../model/state/visited.enum';
import { Modified } from '../../../../model/state/modified.enum';
import { AggregatedStateChanges } from '../../../../model/aggregators/aggregated-state-changes.interface';
import { SyncValidator } from '../../../../model/validators/sync-validator.type';

describe('FinalizerFacingMultiInpuValidatedFormElement', () => {
  test('state returns the base form element\'s value.', () => {
    const expectedValue = 'test';

    const mockField = new MockField(expectedValue, Validity.VALID_FINALIZABLE);

    const multiInputValidatedFormElements = 
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        mockField
      );

    const finalizerFacingMultiInputValidatedFormElement = multiInputValidatedFormElements[1];

    expect(finalizerFacingMultiInputValidatedFormElement.state.value).toBe(expectedValue);
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

    const finalizerFacingMultiInputValidatedFormElement = multiInputValidatedFormElements[1];

    expect(finalizerFacingMultiInputValidatedFormElement.state.messages).toStrictEqual(expectedMessages);
  });

  test('state returns the base form element\'s omit.', () => {
    const baseField = container.services.BaseFieldFactory.createField('', true, [], []);

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const finalizerFacingMultiInputValidatedFormElement = multiInputValidatedFormElements[1];

    expect(finalizerFacingMultiInputValidatedFormElement.state.omit).toBe(true);
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

    const finalizerFacingMultiInputValidatedFormElement = multiInputValidatedFormElements[1];

    expect(finalizerFacingMultiInputValidatedFormElement.state.visited).toBe(Visited.YES);
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

    const finalizerFacingMultiInputValidatedFormElement = multiInputValidatedFormElements[1];

    expect(finalizerFacingMultiInputValidatedFormElement.state.modified).toBe(Modified.YES);
  });

  test('state returns the base form element\'s useSecondaryField if the base form element is an instance of AbstractDualField.', () => {
    const baseField = container.services.BaseFieldFactory.createDualField('', '', false, [], []);
    baseField.useSecondaryField = true;

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const finalizerFacingMultiInputValidatedFormElement = multiInputValidatedFormElements[1];

    expect(finalizerFacingMultiInputValidatedFormElement.state.useSecondaryField).toBe(true);
  });

  test('state returns the minimum of the base form element\'s validity and any attached validator\'s validitiy.', () => {
    const fields = {
      fieldA : container.services.BaseFieldFactory.createField('', false, [required('Field A is required')], []),
      fieldB : container.services.BaseFieldFactory.createField('', false, [], [])
    }

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      fields.fieldA
    );

    const finalizerFacingMultiInputValidatedFormElement = multiInputValidatedFormElements[1];

    expect(finalizerFacingMultiInputValidatedFormElement.state.validity).toBe(Validity.INVALID);

    fields.fieldA.setValue('new value');

    expect(finalizerFacingMultiInputValidatedFormElement.state.validity).toBe(Validity.VALID_FINALIZABLE);

    const multiInputValidatorBaseFn : SyncValidator<AggregatedStateChanges> = ({fieldA, fieldB}) => {
      return {
        isValid : fieldA.value && fieldB.value
      }
    }

    const multiInputValidator = container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(multiInputValidatorBaseFn, fields);

    finalizerFacingMultiInputValidatedFormElement.addValidator(multiInputValidator);

    expect(finalizerFacingMultiInputValidatedFormElement.state.validity).toBe(Validity.INVALID);
  });

  test('omit returns the base form element\'s omit.', () => {
    const baseField = container.services.BaseFieldFactory.createField('', true, [], []);

    const multiInputValidatedFormElements = 
    container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
      baseField
    );

    const finalizerFacingMultiInputValidatedFormElement = multiInputValidatedFormElements[1];

    expect(finalizerFacingMultiInputValidatedFormElement.omit).toBe(true);
  });
});