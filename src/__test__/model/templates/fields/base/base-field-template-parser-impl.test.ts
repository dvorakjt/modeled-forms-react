import { describe, test, expect, beforeEach } from 'vitest';
import { BaseFieldTemplateParser } from '../../../../../model/templates/fields/base/base-field-template-parser.interface';
import { BaseFieldTemplateParserImpl } from '../../../../../model/templates/fields/base/base-field-template-parser-impl';
import { container } from '../../../../../model/container';
import { AbstractField } from '../../../../../model/fields/base/abstract-field';
import { FieldTemplateVariations } from '../../../../../model/templates/fields/field-template-variations.type';
import { BaseFieldParsingError } from '../../../../../model/templates/fields/base/base-field-parsing-error.error';
import { required } from '../../../../../model';
import { AbstractDualField } from '../../../../../model/fields/base/abstract-dual-field';

describe('BaseFieldTemplateParserImpl', () => {
  let baseFieldTemplateParser: BaseFieldTemplateParser;

  beforeEach(() => {
    baseFieldTemplateParser = new BaseFieldTemplateParserImpl(
      container.services.BaseFieldFactory,
    );
  });

  test('It returns an instance of AbstractField when a string is passed in as the template.', () => {
    expect(baseFieldTemplateParser.parseTemplate('')).toBeInstanceOf(
      AbstractField,
    );
  });

  test('An error is thrown if the template is not a string or an object.', () => {
    const invalidTemplate = 3;

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if omitByDefault is included in the template, but it is not of type boolean.', () => {
    const invalidTemplate = {
      defaultValue: '',
      omitByDefault: 'YES',
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if syncValidators is included in the template, but it is not an array.', () => {
    const invalidTemplate = {
      defaultValue: '',
      syncValidators: {},
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if asyncValidators is included in the template, but it is not an array.', () => {
    const invalidTemplate = {
      defaultValue: '',
      asyncValidators: {},
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if pendingAsyncValidatorMessage is included in the template, but it is not a string.', () => {
    const invalidTemplate = {
      defaultValue: '',
      pendingAsyncValidatorMessage: 3,
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if both defaultValue and primaryDefaultValue are present in the template.', () => {
    const invalidTemplate = {
      defaultValue: '',
      primaryDefaultValue: '',
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if both defaultValue and secondaryDefaultValue are present in the template.', () => {
    const invalidTemplate = {
      defaultValue: '',
      secondaryDefaultValue: '',
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if template does not contain either defaultValue, primaryDefaultValue or secondaryDefaultValue.', () => {
    const invalidTemplate = {};

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if template contains defaultValue but it is not a string.', () => {
    const invalidTemplate = {
      defaultValue: 3,
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if template contains primaryDefaultValue and secondaryDefaultValue but they are not strings.', () => {
    const invalidTemplate = {
      primaryDefaultValue: false,
      secondaryDefaultValue: {
        hello: 'world',
      },
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if template contains primaryDefaultValue but not secondaryDefaultValue.', () => {
    const invalidTemplate = {
      primaryDefaultValue: '',
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if template contains secondaryDefaultValue but not primaryDefaultValue.', () => {
    const invalidTemplate = {
      secondaryDefaultValue: '',
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if template contains primaryDefaultValue but secondaryDefaultValue is not a string.', () => {
    const invalidTemplate = {
      primaryDefaultValue: '',
      secondaryDefaultValue: false,
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An error is thrown if template contains secondaryDefaultValue but primaryDefaultValue is not a string.', () => {
    const invalidTemplate = {
      primaryDefaultValue: false,
      secondaryDefaultValue: '',
    };

    let error: any;

    try {
      baseFieldTemplateParser.parseTemplate(
        invalidTemplate as unknown as FieldTemplateVariations,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(BaseFieldParsingError);
    }
  });

  test('An instance of AbstractField is returned if the template is a valid AbstractField template.', () => {
    const validTemplate: FieldTemplateVariations = {
      defaultValue: '',
      syncValidators: [required('this field is required')],
      asyncValidators: [
        (value: string) => {
          return new Promise(resolve => {
            const isValid = value.length > 0;

            resolve({
              isValid,
            });
          });
        },
      ],
      pendingAsyncValidatorMessage: 'validating...',
      omitByDefault: false,
    };

    const field = baseFieldTemplateParser.parseTemplate(validTemplate);

    expect(field).toBeInstanceOf(AbstractField);
  });

  test('An instance of AbstractDualField is returned if the template is a valid AbstractDualField template.', () => {
    const validTemplate: FieldTemplateVariations = {
      primaryDefaultValue: '',
      secondaryDefaultValue: '',
      syncValidators: [required('this field is required')],
      asyncValidators: [
        (value: string) => {
          return new Promise(resolve => {
            const isValid = value.length > 0;

            resolve({
              isValid,
            });
          });
        },
      ],
      pendingAsyncValidatorMessage: 'validating...',
      omitByDefault: false,
    };

    const dualField = baseFieldTemplateParser.parseTemplate(validTemplate);

    expect(dualField).toBeInstanceOf(AbstractDualField);
  });
});
