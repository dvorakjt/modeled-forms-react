import { describe, beforeEach, test, expect } from 'vitest';
import { MultiInputValidatedFormElementFactoryImpl } from '../../../../model/form-elements/multi-input-validated/multi-input-validated-form-element-factory-impl';
import { container } from '../../../../model/container';
import { MultiInputValidatedFormElementFactory } from '../../../../model/form-elements/multi-input-validated/multi-input-validated-form-element-factory.interface';
import { UserFacingMultiInputValidatedField } from '../../../../model/form-elements/multi-input-validated/user-facing-multi-input-validated-field';
import { FinalizerFacingMultiInputValidatedFormElement } from '../../../../model/form-elements/multi-input-validated/finalizer-facing-multi-input-validated-form-element';
import { UserFacingMultiInputValidatedDualField } from '../../../../model/form-elements/multi-input-validated/user-facing-multi-input-validated-dual-field';
import { NestedFormTemplate } from '../../../../model';
import { UserFacingMultiInputValidatedNestedForm } from '../../../../model/form-elements/multi-input-validated/user-facing-multi-input-validated-nested-form';

describe('MultiInputValidatedFormElementFactoryImpl', () => {
  let multiInputValidatedFormElementFactoryImpl : MultiInputValidatedFormElementFactory;

  beforeEach(() => {
    multiInputValidatedFormElementFactoryImpl = new MultiInputValidatedFormElementFactoryImpl(
      container.services.ReducerFactory
    );
  });
  
  test('createUserAndFinalizerFacingMultiInputValidatedFormElement() returns a UserFacingMultiInputValidatedField and a FinalizerFacingMultiInputValidatedFormElement when called with an AbstractField.', () => {
    const baseField = container.services.BaseFieldFactory.createField('', false, [], []);
    const [userFacingMultiInputValidatedField, finalizerFacingMultiInputValidatedFormElement] = 
      multiInputValidatedFormElementFactoryImpl.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField
      );
    expect(userFacingMultiInputValidatedField).toBeInstanceOf(UserFacingMultiInputValidatedField);
    expect(finalizerFacingMultiInputValidatedFormElement).toBeInstanceOf(FinalizerFacingMultiInputValidatedFormElement);
  });

  test('createUserAndFinalizerFacingMultiInputValidatedFormElement() returns a  UserFacingMultiInputValidatedDualField and a FinalizerFacingMultiInputValidatedFormElement when called with an AbstractDualField.', () => {
    const baseDualField = container.services.BaseFieldFactory.createDualField('', '', false, [], []);
    const [userFacingMultiInputValidatedDualField, finalizerFacingMultiInputValidatedFormElement] = 
      multiInputValidatedFormElementFactoryImpl.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseDualField
      );
    expect(userFacingMultiInputValidatedDualField).toBeInstanceOf(UserFacingMultiInputValidatedDualField);
    expect(finalizerFacingMultiInputValidatedFormElement).toBeInstanceOf(FinalizerFacingMultiInputValidatedFormElement);
  });

  test('createUserAndFinalizerFacingMultiInputValidatedFormElement() returns a UserFacingMultiInputValidatedNestedForm and a FinalizerFacingMultiInputValidatedFormElement when called with an AbstractNestedForm.', () => {
    const nestedFormTemplate : NestedFormTemplate = {
      fields : {
        fieldA : '',
        fieldB : ''
      }
    }

    const baseNestedForm = container.services.NestedFormTemplateParser.parseTemplate(nestedFormTemplate);

    const [userFacingMultiInputValidatedNestedForm, finalizerFacingMultiInputValidatedFormElement] = 
      multiInputValidatedFormElementFactoryImpl.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseNestedForm
      );
    
    expect(userFacingMultiInputValidatedNestedForm).toBeInstanceOf(UserFacingMultiInputValidatedNestedForm);
    expect(finalizerFacingMultiInputValidatedFormElement).toBeInstanceOf(FinalizerFacingMultiInputValidatedFormElement);
  });
});