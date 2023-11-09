import { describe, test, expect, vi } from 'vitest';
import { container } from '../../../../model/container';
import { MockField } from '../../../util/mocks/mock-field';
import {
  DualFieldSetStateArg,
  DualFieldSetValueArg,
  MessageType,
  Validity,
  required,
} from '../../../../model';
import { Visited } from '../../../../model/state/visited.enum';
import { Modified } from '../../../../model/state/modified.enum';
import { SyncValidator } from '../../../../model/validators/sync-validator.type';
import { AggregatedStateChanges } from '../../../../model/aggregators/aggregated-state-changes.interface';
import { UserFacingMultiInputValidatedField } from '../../../../model/form-elements/multi-input-validated/user-facing-multi-input-validated-field';
import { DualField } from '../../../../model/fields/base/dual-field';
import { UserFacingMultiInputValidatedDualField } from '../../../../model/form-elements/multi-input-validated/user-facing-multi-input-validated-dual-field';

describe('UserFacingMultiInputValidatedDualField', () => {
  test("state returns the base form element's value.", () => {
    const expectedValue = 'test';

    const baseField = container.services.BaseFieldFactory.createDualField(
      expectedValue,
      '',
      false,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedDualField.state.value).toBe(
      expectedValue,
    );
  });

  test("state returns the base form element's messages.", () => {
    const invalidMessageText = 'Field is required';

    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [required(invalidMessageText)],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedDualField.state.messages).toStrictEqual(
      [
        {
          text: invalidMessageText,
          type: MessageType.INVALID,
        },
      ],
    );
  });

  test("state returns the base form element's omit.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      true,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedDualField.state.omit).toBe(true);
  });

  test("state returns the base form element's visited.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );
    baseField.setState({
      primaryFieldState: {
        visited: Visited.YES,
      },
    });

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedDualField.state.visited).toBe(
      Visited.YES,
    );
  });

  test("state returns the base form element's modified.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );
    baseField.setState({
      primaryFieldState: {
        modified: Modified.YES,
      },
    });

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedDualField.state.modified).toBe(
      Modified.YES,
    );
  });

  test("state returns the minimum of the base field's validity and any attached validator's validitiy.", () => {
    const fields = {
      fieldA: container.services.BaseFieldFactory.createDualField(
        '',
        '',
        false,
        [required('Field A is required')],
        [],
      ),
      fieldB: container.services.BaseFieldFactory.createField(
        '',
        false,
        [],
        [],
      ),
    };

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        fields.fieldA,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedDualField.state.validity).toBe(
      Validity.INVALID,
    );

    fields.fieldA.setValue({
      primaryFieldValue: 'new value',
    });

    expect(userFacingMultiInputValidatedDualField.state.validity).toBe(
      Validity.VALID_FINALIZABLE,
    );

    const multiInputValidatorBaseFn: SyncValidator<AggregatedStateChanges> = ({
      fieldA,
      fieldB,
    }) => {
      return {
        isValid: fieldA.value && fieldB.value,
      };
    };

    const multiInputValidator =
      container.services.MultiInputValidatorFactory.createSyncMultiInputValidator(
        multiInputValidatorBaseFn,
        fields,
      );

    userFacingMultiInputValidatedDualField.addValidator(multiInputValidator);

    expect(userFacingMultiInputValidatedDualField.state.validity).toBe(
      Validity.INVALID,
    );
  });

  test("state returns the baseField's useSecondaryField property.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedDualField.state.useSecondaryField).toBe(
      false,
    );

    baseField.setState({
      useSecondaryField: true,
    });

    expect(userFacingMultiInputValidatedDualField.state.useSecondaryField).toBe(
      true,
    );
  });

  test("primaryField returns the base field's primary field.", () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);

    const baseField = new DualField(primaryField, secondaryField, false);

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedDualField;

    expect(userFacingMultiInputValidatedDualField.primaryField).toBe(
      primaryField,
    );
  });

  test("secondaryField returns the base field's secondary field.", () => {
    const primaryField = new MockField('', Validity.VALID_FINALIZABLE);
    const secondaryField = new MockField('', Validity.VALID_FINALIZABLE);

    const baseField = new DualField(primaryField, secondaryField, false);

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedDualField;

    expect(userFacingMultiInputValidatedDualField.secondaryField).toBe(
      secondaryField,
    );
  });

  test("useSecondaryField returns the base field's useSecondaryField.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedDualField;

    expect(userFacingMultiInputValidatedDualField.useSecondaryField).toBe(
      false,
    );

    baseField.useSecondaryField = true;

    expect(userFacingMultiInputValidatedDualField.useSecondaryField).toBe(true);
  });

  test("setting useSecondaryField sets the base field's useSecondaryField.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedDualField;

    userFacingMultiInputValidatedDualField.useSecondaryField = true;

    expect(baseField.useSecondaryField).toBe(true);
  });

  test("omit returns the base field's omit.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      true,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0];

    expect(userFacingMultiInputValidatedDualField.omit).toBe(true);
  });

  test("setting omit sets the base field's omit property.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0];

    userFacingMultiInputValidatedDualField.omit = true;
    expect(baseField.omit).toBe(true);
  });

  test("calling setState() calls the base field's setState() method.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedField;

    vi.spyOn(baseField, 'setState');

    const expectedSetStateArg: DualFieldSetStateArg = {
      primaryFieldState: {
        value: 'test',
        validity: Validity.VALID_FINALIZABLE,
        messages: [
          {
            text: 'some message',
            type: MessageType.VALID,
          },
        ],
        visited: Visited.YES,
        modified: Modified.YES,
        omit: false,
      },
    };

    userFacingMultiInputValidatedDualField.setState(expectedSetStateArg);

    expect(baseField.setState).toHaveBeenCalledWith(expectedSetStateArg);
  });

  test("calling setValue() calls the base field's setValue() method.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedField;

    vi.spyOn(baseField, 'setValue');

    const expectedSetValueArg: DualFieldSetValueArg = {
      primaryFieldValue: 'new value',
    };

    userFacingMultiInputValidatedDualField.setValue(expectedSetValueArg);

    expect(baseField.setValue).toHaveBeenCalledWith(expectedSetValueArg);
  });

  test("calling reset() calls the base field's reset() method.", () => {
    const baseField = container.services.BaseFieldFactory.createDualField(
      '',
      '',
      false,
      [],
      [],
    );

    const multiInputValidatedFormElements =
      container.services.MultiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
        baseField,
      );

    const userFacingMultiInputValidatedDualField =
      multiInputValidatedFormElements[0] as UserFacingMultiInputValidatedField;

    vi.spyOn(baseField, 'reset');

    userFacingMultiInputValidatedDualField.reset();

    expect(baseField.reset).toHaveBeenCalledOnce();
  });
});
