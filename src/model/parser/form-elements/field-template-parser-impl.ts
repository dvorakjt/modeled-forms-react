import { NestedFormImpl } from "../../constituents/forms/nested-form-impl";
import { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import { NestedForm } from "../../types/constituents/forms/nested-form.interface";
import { DualFieldTemplate } from "../../types/parser/form-elements/dual-field-template.interface";
import { FieldTemplateParser } from "../../types/parser/form-elements/field-template-parser.interface";
import { FieldTemplateVariations } from "../../types/parser/form-elements/field-template-variations.type";
import { FieldTemplate } from "../../types/parser/form-elements/field-template.type";
import { ParsedDualFieldTemplate } from "../../types/parser/form-elements/parsed-dual-field-template.interface";
import { ParsedFieldTemplate } from "../../types/parser/form-elements/parsed-field-template.interface";
import { StateControlledDualFieldTemplate } from "../../types/parser/form-elements/state-controlled-dual-field-template.type";
import { StateControlledFieldTemplate } from "../../types/parser/form-elements/state-controlled-field-template.type";
import { ValueControlledDualFieldTemplate } from "../../types/parser/form-elements/value-controlled-dual-field-template.type";
import { ValueControlledFieldTemplate } from "../../types/parser/form-elements/value-controlled-field-template.type";

export class FieldTemplateParserImpl<Fields extends FormElementMap> implements FieldTemplateParser<Fields> {
  #template : NestedForm | FieldTemplateVariations<string>;

  get isNestedForm() {
    return this.#template instanceof NestedFormImpl;
  }

  get isDualField() {
    return (
      !this.isNestedForm && typeof this.#template !== 'string' && !('defaultValue' in this.#template)
    )
  }

  private get isStateControlledField() {
    return !this.isNestedForm && typeof this.#template !== 'string' && ('stateControlFn' in this.#template);
  }

  private get isValueControlledField() {
    return !this.isNestedForm && typeof this.#template !== 'string' && ('valueControlFn' in this.#template);
  }

  get baseObject() : NestedForm | ParsedFieldTemplate | ParsedDualFieldTemplate {
    if(this.isNestedForm) return this.#template as NestedForm;
    else if(this.isDualField) return this.createBaseDualFieldObj();
    else return this.createBaseFieldObj();
  }

  get stateControlFn() {
    return this.isStateControlledField ? (this.#template as StateControlledFieldTemplate<string> | StateControlledDualFieldTemplate<string>).stateControlFn : undefined;
  }

  get valueControlFn() {
    return this.isValueControlledField ? (this.#template as ValueControlledFieldTemplate<string> | ValueControlledDualFieldTemplate<string>).valueControlFn : undefined;
  }

  constructor(template : NestedForm | FieldTemplateVariations<string>) {
    this.#template = template;
    this.checkTemplate();
  }

  private checkTemplate() {
    if(typeof this.#template === 'string' || this.#template instanceof NestedFormImpl) return;

    if(typeof this.#template !== 'object') throw new Error(
      `FieldTemplateParser expected to receive argument of type <string | NestedFormImpl | object>. Received ${typeof this.#template}.`
    );

    if(!('defaultValue' in this.#template) && !('primaryDefaultValue' in this.#template && 'secondaryDefaultValue' in this.#template)) {
      throw new Error('Object passed to FormTemplateParser did not include properties defaultValue or both primaryDefaultValue and secondaryDefaultValue.');
    }

    if('defaultValue' in this.#template && ('primaryDefaultValue' in this.#template || 'secondaryDefaultValue' in this.#template)) {
      throw new Error('FieldTemplateParser received ambiguous object. Include only defaultValue or both primaryDefaultValue and secondaryDefaultValue.');
    };

    if('stateControlFn' in this.#template && 'valueControlFn' in this.#template) {
      throw new Error('FieldTemplateParser received ambiguous object. Include only stateControlFn or valueControlFn.');
    }
  }

  private createBaseFieldObj() : ParsedFieldTemplate {
    if(typeof this.#template === 'string') {
      return {
        defaultValue : this.#template,
        syncValidators : [],
        asyncValidators : [],
        omitByDefault : false
      }
    } else {
      const fieldTemplate = this.#template as FieldTemplate;
      return {
        defaultValue : fieldTemplate.defaultValue,
        syncValidators : fieldTemplate.syncValidators ? fieldTemplate.syncValidators : [],
        asyncValidators : fieldTemplate.asyncValidators ? fieldTemplate.asyncValidators : [],
        omitByDefault : fieldTemplate.omitByDefault as boolean,
        pendingAsyncValidatorMessage : fieldTemplate.pendingAsyncValidatorMessage
      }
    }
  }

  private createBaseDualFieldObj() : ParsedDualFieldTemplate {
    const dualFieldTemplate = this.#template as DualFieldTemplate;
    return {
      primaryDefaultValue : dualFieldTemplate.primaryDefaultValue,
      secondaryDefaultValue : dualFieldTemplate.secondaryDefaultValue,
      syncValidators : dualFieldTemplate.syncValidators ? dualFieldTemplate.syncValidators : [],
      asyncValidators : dualFieldTemplate.asyncValidators ? dualFieldTemplate.asyncValidators : [],
      omitByDefault : dualFieldTemplate.omitByDefault as boolean,
      pendingAsyncValidatorMessage : dualFieldTemplate.pendingAsyncValidatorMessage
    }
  }
}