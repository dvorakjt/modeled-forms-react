import { NestedFormImpl } from "../../constituents/forms/nested-form-impl";
import { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import { NestedForm } from "../../types/constituents/forms/nested-form.interface";
import { AsyncStateControlledDualFieldTemplate } from "../../types/parser/form-elements/async-state-controlled-dual-field-template.type";
import { AsyncStateControlledFieldTemplate } from "../../types/parser/form-elements/async-state-controlled-field-template.type";
import { AsyncValueControlledDualFieldTemplate } from "../../types/parser/form-elements/async-value-controlled-dual-field-template.type";
import { AsyncValueControlledFieldTemplate } from "../../types/parser/form-elements/async-value-controlled-field-template.type";
import { DualFieldTemplate } from "../../types/parser/form-elements/dual-field-template.interface";
import { FieldTemplateParser } from "../../types/parser/form-elements/field-template-parser.interface";
import { FieldTemplateVariations } from "../../types/parser/form-elements/field-template-variations.type";
import { FieldTemplate } from "../../types/parser/form-elements/field-template.type";
import { ParsedDualFieldTemplate } from "../../types/parser/form-elements/parsed-dual-field-template.interface";
import { ParsedFieldTemplate } from "../../types/parser/form-elements/parsed-field-template.interface";
import { SyncStateControlledDualFieldTemplate } from "../../types/parser/form-elements/sync-state-controlled-dual-field-template.type";
import { SyncStateControlledFieldTemplate } from "../../types/parser/form-elements/sync-state-controlled-field-template.type";
import { SyncValueControlledDualFieldTemplate } from "../../types/parser/form-elements/sync-value-controlled-dual-field-template.type";
import { SyncValueControlledFieldTemplate } from "../../types/parser/form-elements/sync-value-controlled-field-template.type";

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
  get baseObject() : NestedForm | ParsedFieldTemplate | ParsedDualFieldTemplate {
    if(this.isNestedForm) return this.#template as NestedForm;
    else if(this.isDualField) return this.createBaseDualFieldObj();
    else return this.createBaseFieldObj();
  }
  get syncValueControlFn() {
    if(this.isSyncValueControlledField) {
      const syncValueControlledTemplate = 
        this.isDualField ? this.#template as SyncValueControlledDualFieldTemplate<string> :
          this.#template as SyncValueControlledFieldTemplate<string>;
      return syncValueControlledTemplate.syncValueControlFn;
    } else return undefined;
  }
  get asyncValueControlFn() {
    if(this.isAsyncValueControlledField) {
      const asyncValueControlledTemplate = 
        this.isDualField ? this.#template as AsyncValueControlledDualFieldTemplate<string> :
          this.#template as AsyncValueControlledFieldTemplate<string>;
      return asyncValueControlledTemplate.asyncValueControlFn;
    } else return undefined;
  }
  get syncStateControlFn() {
    if(this.isSyncStateControlledField) {
      const syncStateControlledTemplate = 
        this.isDualField ? this.#template as SyncStateControlledDualFieldTemplate<string> :
          this.#template as SyncStateControlledFieldTemplate<string>;
      return syncStateControlledTemplate.syncStateControlFn;
    } else return undefined;
  }
  get asyncStateControlFn() {
    if(this.isAsyncStateControlledField) {
      const asyncStateControlledTemplate = 
        this.isDualField ? this.#template as AsyncStateControlledDualFieldTemplate<string> :
          this.#template as AsyncStateControlledFieldTemplate<string>;
      return asyncStateControlledTemplate.asyncStateControlFn;
    } else return undefined;
  }

  private get isSyncStateControlledField() {
    return !this.isNestedForm && typeof this.#template !== 'string' && ('syncStateControlFn' in this.#template);
  }

  private get isSyncValueControlledField() {
    return !this.isNestedForm && typeof this.#template !== 'string' && ('syncValueControlFn' in this.#template);
  }

  
  private get isAsyncStateControlledField() {
    return !this.isNestedForm && typeof this.#template !== 'string' && ('asyncStateControlFn' in this.#template);
  }

  private get isAsyncValueControlledField() {
    return !this.isNestedForm && typeof this.#template !== 'string' && ('asyncValueControlFn' in this.#template);
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

    let controlFnFlags = 0;
    if(this.isSyncStateControlledField) controlFnFlags++;
    if(this.isSyncValueControlledField) controlFnFlags++;
    if(this.isAsyncStateControlledField) controlFnFlags++;
    if(this.isAsyncValueControlledField) controlFnFlags++;
    if(controlFnFlags > 1) {
      throw new Error('FieldTemplateParser received ambiguous object. Include only one type of control function.');
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
        omitByDefault : fieldTemplate.omitByDefault ? true : false,
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
      omitByDefault : dualFieldTemplate.omitByDefault ? true : false,
      pendingAsyncValidatorMessage : dualFieldTemplate.pendingAsyncValidatorMessage
    }
  }
}