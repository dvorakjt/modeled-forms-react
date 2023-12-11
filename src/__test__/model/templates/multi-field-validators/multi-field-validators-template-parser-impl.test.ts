import { describe, test, expect } from 'vitest';
import { container } from '../../../../model/container';
import { MultiFieldValidatorsTemplate } from '../../../../model/templates/multi-field-validators/multi-field-validators-template.interface';
import { MockField } from '../../../testing-util/mocks/mock-field';
import { Validity } from '../../../../model';
import { UserFacingMultiInputValidatedField } from '../../../../model/form-elements/multi-input-validated/user-facing-multi-input-validated-field';

describe('MultiFieldValidatorsTemplateParserImpl', () => {
  test('A template containing an async field will produce async MultiInpuValidators.', () => {
    const fields = {
      fieldA: new MockField('', Validity.VALID_FINALIZABLE),
      fieldB: new MockField('', Validity.VALID_FINALIZABLE),
      fieldC: new MockField('', Validity.VALID_FINALIZABLE),
      fieldD: new MockField('', Validity.VALID_FINALIZABLE),
    };

    const template: MultiFieldValidatorsTemplate = {
      async: [
        {
          validatorFn: ({ fieldA, fieldB }) => {
            return new Promise(resolve => {
              const isValid = fieldA.value && fieldB.value;

              resolve({
                isValid,
              });
            });
          },
        },
        {
          validatorFn: ({ fieldC, fieldD }) => {
            return new Promise(resolve => {
              const isValid = fieldC.value && fieldD.value;

              resolve({
                isValid,
              });
            });
          },
          pendingValidatorMessage: 'validating...',
        },
      ],
    };

    const parsed =
      container.services.MultiFieldValidatorsTemplateParser.parseTemplate(
        template,
        fields,
      );
    const userFacingFields = parsed[0];
    expect(userFacingFields.fieldA).toBeInstanceOf(
      UserFacingMultiInputValidatedField,
    );
    expect(userFacingFields.fieldB).toBeInstanceOf(
      UserFacingMultiInputValidatedField,
    );
    expect(userFacingFields.fieldC).toBeInstanceOf(
      UserFacingMultiInputValidatedField,
    );
    expect(userFacingFields.fieldD).toBeInstanceOf(
      UserFacingMultiInputValidatedField,
    );
  });
});
