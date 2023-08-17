import { autowire } from "undecorated-di";
import { DualField } from "../../../fields/base/dual-field.interface";
import { Field } from "../../../fields/base/field.interface";
import { FieldTemplateVariations } from "../field-template-variations.type";
import { BaseFieldTemplateParserKey, type BaseFieldTemplateParser, type BaseFieldTemplateParserKeyType } from "./base-field-template-parser.interface";
import { type BaseFieldFactory, BaseFieldFactoryKey } from "../../../fields/base/base-field-factory.interface";
import { FieldTemplate } from "./field-template.type";
import { BaseFieldParsingError } from "./base-field-parsing-error";
import { BaseFieldTemplateTypes } from "./base-field-template-types.enum";
import { DualFieldTemplate } from "./dual-field-template.interface";
import { BaseFieldTemplate } from "./base-field-template.type";
import type { SyncValidator } from "../../../validators/sync-validator.type";
import type { AsyncValidator } from "../../../validators/async-validator.type";

type ExtractedBaseFields = [
  boolean,
  Array<SyncValidator<string>>,
  Array<AsyncValidator<string>>
]

class BaseFieldTemplateParserImpl implements BaseFieldTemplateParser {
  #baseFieldFactory : BaseFieldFactory;

  constructor(baseFieldFactory : BaseFieldFactory) {
    this.#baseFieldFactory = baseFieldFactory;
  }

  parseTemplate(template: FieldTemplateVariations): Field | DualField {
    if(typeof template === 'string') return this.parseString(template);

    else {
      const templateType = this.determineTemplateType(template);

      if(templateType === BaseFieldTemplateTypes.DUAL_FIELD) {
        return this.parseDualFieldTemplate(template as DualFieldTemplate);
      } else return this.parseFieldTemplate(template as FieldTemplate);
    }
  }
  
  private parseString(template : string) {
    return this.#baseFieldFactory.createField(template, false, [], []);
  }

  private determineTemplateType(template : FieldTemplateVariations) : BaseFieldTemplateTypes {
    if(typeof template !== 'object') throw new BaseFieldParsingError('Field template was not a string or an object.');

    const isField = 'defaultValue' in template && template.defaultValue;
    const isDualField = ('primaryDefaultValue' in template && template.primaryDefaultValue) ||
      ('secondaryDefaultValue' in template && template.primaryDefaultValue);

    if(isField && isDualField) throw new BaseFieldParsingError('BaseFieldTemplateParser received ambiguous field template: template contains both defaultValue and primaryDefaultValue/secondaryDefaultValue fields.');
    if(!isField && !isDualField) throw new BaseFieldParsingError('Field template did not include a defaultValue or a primaryDefaultValue property.');

    return isDualField ? BaseFieldTemplateTypes.DUAL_FIELD : BaseFieldTemplateTypes.FIELD;
  }

  //at this point, we know the field has a defaultValue property and lacks primaryDefaultValue/secondaryDefaultValue
  private parseFieldTemplate(template : FieldTemplate) : Field {
    if(typeof template.defaultValue !== 'string') {
      throw new BaseFieldParsingError('BaseFieldTemplateParser received a template object whose defaultValue was not of type \'string\'');
    }
    this.validateBaseFieldTemplate(template);
    const baseFieldProps = this.extractBaseFieldProperties(template);
    return this.#baseFieldFactory.createField(template.defaultValue, ...baseFieldProps, template.pendingAsyncValidatorMessage);
  }

  private parseDualFieldTemplate(template : DualFieldTemplate) {
    if(!('primaryDefaultValue' in template)) {
      throw new BaseFieldParsingError('BaseFieldTemplateParser received a template object containing a secondaryDefaultValue property, but not a primaryDefaultValue property. If you wish to create a dual field, ensure that both properties are included in the template.');
    }
    if(!('secondaryDefaultValue' in template)) {
      throw new BaseFieldParsingError('BaseFieldTemplateParser received a template object containing a primaryDefaultValue property, but not a secondaryDefaultValue property. If you wish to create a dual field, ensure that both properties are included in the template.');
    }
    if(typeof template.primaryDefaultValue !== 'string') {
      throw new BaseFieldParsingError('BaseFieldTemplateParser received a template object whose primaryDefaultValue was not of type string.');
    }
    if(typeof template.secondaryDefaultValue !== 'string') {
      throw new BaseFieldParsingError('BaseFieldTemplateParser received a template object whose secondaryDefaultValue was not of type string.');
    }
    this.validateBaseFieldTemplate(template);
    const extractBaseFieldProperties = this.extractBaseFieldProperties(template);
    return this.#baseFieldFactory.createDualField(
      template.primaryDefaultValue,
      template.secondaryDefaultValue,
      ...extractBaseFieldProperties,
      template.pendingAsyncValidatorMessage
    );
  }

  private validateBaseFieldTemplate(template : BaseFieldTemplate) {
    if('omitByDefault' in template && typeof template.omitByDefault !== 'boolean') {
      throw new BaseFieldParsingError('BaseFieldTemplateParser received a template object whose omitByDefault property was not of type \'boolean.\'');
    }
    if('syncValidators' in template && !Array.isArray(template.syncValidators)) {
      throw new BaseFieldParsingError('BaseFieldTemplateParser received a template object whose syncValidators property was set and was not an array. Either omit the property or set it to an array.')
    }
    if('asyncValidators' in template && !Array.isArray(template.asyncValidators)) {
      throw new BaseFieldParsingError('BaseFieldTemplateParser received a template object whose asyncValidators property was set and was not an array. Either omit the property or set it to an array.')
    }
    if('pendingAsyncValidatorMessage' in template && typeof template.pendingAsyncValidatorMessage !== 'string') {
      throw new BaseFieldParsingError('BaseFieldTemplateParser received a template object whose pendingAsyncValidatorMessage property was set and was not a string. Either omit the property or set it to a string.')
    }
  }

  private extractBaseFieldProperties(template : BaseFieldTemplate) : ExtractedBaseFields {
    const omitByDefault = template.omitByDefault ?? false;
    const syncValidators = template.syncValidators ?? [];
    const asyncValidators = template.asyncValidators ?? [];
    return [omitByDefault, syncValidators, asyncValidators];
  }
}

const BaseFieldTemplateParserService = 
  autowire<
    BaseFieldTemplateParserKeyType, 
    BaseFieldTemplateParser, 
    BaseFieldTemplateParserImpl
  >(
    BaseFieldTemplateParserImpl,
    BaseFieldTemplateParserKey,
    [
      BaseFieldFactoryKey
    ]
  );

export { BaseFieldTemplateParserImpl, BaseFieldTemplateParserService };