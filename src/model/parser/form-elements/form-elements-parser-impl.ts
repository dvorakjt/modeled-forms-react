import { BaseFieldFactory } from "../../types/constituents/fields/base-field-factory.interface";
import { DualStateControlFn } from "../../types/constituents/fields/dual-state-control-fn.type";
import { DualValueControlFn } from "../../types/constituents/fields/dual-value-control-fn.type";
import { SimpleStateControlFn } from "../../types/constituents/fields/simple-state-control-fn.type";
import { SimpleValueControlFn } from "../../types/constituents/fields/simple-value-control-fn.type";
import { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import { NestedForm } from "../../types/constituents/forms/nested-form.interface";
import { FieldTemplateVariations } from "../../types/parser/form-elements/field-template-variations.type";
import { FormElementsParser } from "../../types/parser/form-elements/form-elements-parser.interface";
import { ParsedDualFieldTemplate } from "../../types/parser/form-elements/parsed-dual-field-template.interface";
import { ParsedFieldTemplate } from "../../types/parser/form-elements/parsed-field-template.interface";
import { FieldTemplateParserImpl } from "./field-template-parser-impl";

export class FormElementsParserImpl implements FormElementsParser {
  #baseFieldFactory : BaseFieldFactory;
  #fields : FormElementMap = {};
  #stateControlledFields = new Map<string, SimpleStateControlFn<FormElementMap>>();
  #valueControlledFields = new Map<string, SimpleValueControlFn<FormElementMap>>();
  #stateControlledDualFields = new Map<string, DualStateControlFn<FormElementMap>>();
  #valueControlledDualFields = new Map<string, DualValueControlFn<FormElementMap>>();

  constructor(baseFieldFactory : BaseFieldFactory) {
    this.#baseFieldFactory = baseFieldFactory;
  }

  parseTemplate<K extends string>(fields: { [P in K]: NestedForm | FieldTemplateVariations<K>; }): FormElementMap {
    for(const key in fields) {
      const parsed = new FieldTemplateParserImpl(fields[key]); //should come from a factory
      if(parsed.isNestedForm) this.#fields[key] = parsed.baseObject as NestedForm;
      else if(parsed.isDualField) {
        const parsedTemplate = parsed.baseObject as ParsedDualFieldTemplate;
        this.#fields[key] = this.#baseFieldFactory.createDualField(
          parsedTemplate.primaryDefaultValue,
          parsedTemplate.secondaryDefaultValue,
          parsedTemplate.omitByDefault,
          parsedTemplate.syncValidators,
          parsedTemplate.asyncValidators,
          parsedTemplate.pendingAsyncValidatorMessage
        )
        if(parsed.stateControlFn) {
          this.#stateControlledDualFields.set(key, parsed.stateControlFn);
        } else if(parsed.valueControlFn) {
          this.#valueControlledDualFields.set(key, parsed.valueControlFn as DualValueControlFn<FormElementMap>);
        }
      } else {
        const parsedTemplate = parsed.baseObject as ParsedFieldTemplate;
        this.#fields[key] = this.#baseFieldFactory.createField(
          parsedTemplate.defaultValue,
          parsedTemplate.omitByDefault,
          parsedTemplate.syncValidators,
          parsedTemplate.asyncValidators,
          parsedTemplate.pendingAsyncValidatorMessage
        )
        if(parsed.stateControlFn) {
          this.#stateControlledFields.set(key, parsed.stateControlFn as SimpleStateControlFn<FormElementMap>);
        } else if(parsed.valueControlFn) {
          this.#valueControlledFields.set(key, parsed.valueControlFn as SimpleValueControlFn<FormElementMap>);
        }
      }
    }

    //transform controlled fields

    return this.#fields;
  }
  
}