import { BaseFieldFactory } from "../../types/constituents/fields/base-field-factory.interface";
import { AsyncDualStateControlFn } from "../../types/constituents/fields/async-dual-state-control-fn.type";
import { SyncDualValueControlFn } from "../../types/constituents/fields/sync-dual-value-control-fn.type";
import { AsyncFieldStateControlFn } from "../../types/constituents/fields/async-field-state-control-fn.type";
import { AsyncFieldValueControlFn } from "../../types/constituents/fields/async-field-value-control-fn.type";
import { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import { NestedForm } from "../../types/constituents/forms/nested-form.interface";
import { FieldTemplateVariations } from "../../types/parser/form-elements/field-template-variations.type";
import { FormElementsParser } from "../../types/parser/form-elements/form-elements-parser.interface";
import { ParsedDualFieldTemplate } from "../../types/parser/form-elements/parsed-dual-field-template.interface";
import { ParsedFieldTemplate } from "../../types/parser/form-elements/parsed-field-template.interface";
import { FieldTemplateParserImpl } from "./field-template-parser-impl";
import { SyncFieldStateControlFn } from "../../types/constituents/fields/sync-field-state-control-fn.type";
import { SyncFieldValueControlFn } from "../../types/constituents/fields/sync-field-value-control-fn.type";
import { SyncDualStateControlFn } from "../../types/constituents/fields/sync-dual-state-control-fn.type";
import { AsyncDualValueControlFn } from "../../types/constituents/fields/async-dual-value-control-fn.type";
import { ControlledFieldFactory } from "../../types/constituents/fields/controlled-field-factory.interface";
import { Field } from "../../types/constituents/fields/field.interface";
import { DualField } from "../../types/constituents/fields/dual-field.interface";

export class FormElementsParserImpl implements FormElementsParser {
  readonly #baseFieldFactory : BaseFieldFactory;
  readonly #controlledFieldFactory : ControlledFieldFactory;
  readonly #fields : FormElementMap = {};
  readonly #syncStateControlledFields = new Map<string, SyncFieldStateControlFn<FormElementMap>>();
  readonly #syncValueControlledFields = new Map<string, SyncFieldValueControlFn<FormElementMap>>();
  readonly #asyncStateControlledFields = new Map<string, AsyncFieldStateControlFn<FormElementMap>>();
  readonly #asyncValueControlledFields = new Map<string, AsyncFieldValueControlFn<FormElementMap>>();
  readonly #syncStateControlledDualFields = new Map<string, SyncDualStateControlFn<FormElementMap>>();
  readonly #syncValueControlledDualFields = new Map<string, SyncDualValueControlFn<FormElementMap>>();
  readonly #asyncStateControlledDualFields = new Map<string, AsyncDualStateControlFn<FormElementMap>>();
  readonly #asyncValueControlledDualFields = new Map<string, AsyncDualValueControlFn<FormElementMap>>();

  constructor(baseFieldFactory : BaseFieldFactory, controlledFieldFactory : ControlledFieldFactory) {
    this.#baseFieldFactory = baseFieldFactory;
    this.#controlledFieldFactory = controlledFieldFactory;
  }

  parseTemplate<K extends string>(fields: { [P in K]: NestedForm | FieldTemplateVariations<K>; }): FormElementMap {
    for(const fieldName in fields) {
      const parsed = new FieldTemplateParserImpl(fields[fieldName]); //should come from a factory
      if(parsed.isNestedForm) this.#fields[fieldName] = parsed.baseObject as NestedForm;
      else if(parsed.isDualField) {
        const parsedTemplate = parsed.baseObject as ParsedDualFieldTemplate;
        this.#fields[fieldName] = this.#baseFieldFactory.createDualField(
          parsedTemplate.primaryDefaultValue,
          parsedTemplate.secondaryDefaultValue,
          parsedTemplate.omitByDefault,
          parsedTemplate.syncValidators,
          parsedTemplate.asyncValidators,
          parsedTemplate.pendingAsyncValidatorMessage
        )
      } else {
        const parsedTemplate = parsed.baseObject as ParsedFieldTemplate;
        this.#fields[fieldName] = this.#baseFieldFactory.createField(
          parsedTemplate.defaultValue,
          parsedTemplate.omitByDefault,
          parsedTemplate.syncValidators,
          parsedTemplate.asyncValidators,
          parsedTemplate.pendingAsyncValidatorMessage
        )
      }
      if(parsed.syncStateControlFn) {
        if(parsed.isDualField) this.#syncStateControlledDualFields.set(fieldName, parsed.syncStateControlFn);
        else this.#syncStateControlledFields.set(fieldName, parsed.syncStateControlFn as SyncFieldStateControlFn<FormElementMap>);
      } else if(parsed.asyncStateControlFn) {
        if(parsed.isDualField) this.#asyncStateControlledDualFields.set(fieldName, parsed.asyncStateControlFn);
        else this.#asyncStateControlledFields.set(fieldName, parsed.asyncStateControlFn as AsyncFieldStateControlFn<FormElementMap>);
      } else if(parsed.syncValueControlFn) {
        if(parsed.isDualField) this.#syncValueControlledDualFields.set(fieldName, parsed.syncValueControlFn as SyncDualStateControlFn<FormElementMap>);
        else this.#syncValueControlledFields.set(fieldName, parsed.syncValueControlFn as SyncFieldValueControlFn<FormElementMap>);
      } else if(parsed.asyncValueControlFn) {
        if(parsed.isDualField) this.#asyncValueControlledDualFields.set(fieldName, parsed.asyncValueControlFn as AsyncDualValueControlFn<FormElementMap>);
        else this.#asyncValueControlledFields.set(fieldName, parsed.asyncValueControlFn as AsyncFieldValueControlFn<FormElementMap>);
      }
    }

    //transform controlled fields
    for(const [fieldName, controlFn] of this.#syncStateControlledFields.entries()) {
      this.#fields[fieldName] = this.#controlledFieldFactory.createStateControlledFieldWithSyncControlFn(this.#fields[fieldName] as Field, controlFn, this.#fields);
    }
    for(const [fieldName, controlFn] of this.#syncValueControlledFields.entries()) {
      this.#fields[fieldName] = this.#controlledFieldFactory.createValueControlledFieldWithSyncControlFn(this.#fields[fieldName] as Field, controlFn, this.#fields);
    }
    for(const [fieldName, controlFn] of this.#asyncStateControlledFields.entries()) {
      this.#fields[fieldName] = this.#controlledFieldFactory.createStateControlledFieldWithAsyncControlFn(this.#fields[fieldName] as Field, controlFn, this.#fields);
    }
    for(const [fieldName, controlFn] of this.#asyncValueControlledFields.entries()) {
      this.#fields[fieldName] = this.#controlledFieldFactory.createValueControlledFieldWithAsyncControlFn(this.#fields[fieldName] as Field, controlFn, this.#fields);
    }
    for(const [fieldName, controlFn] of this.#syncStateControlledDualFields.entries()) {
      this.#fields[fieldName] = this.#controlledFieldFactory.createStateControlledDualFieldWithSyncControlFn(this.#fields[fieldName] as DualField, controlFn, this.#fields);
    }
    for(const [fieldName, controlFn] of this.#syncValueControlledDualFields.entries()) {
      this.#fields[fieldName] = this.#controlledFieldFactory.createValueControlledDualFieldWithSyncControlFn(this.#fields[fieldName] as DualField, controlFn, this.#fields);
    }
    for(const [fieldName, controlFn] of this.#asyncStateControlledDualFields.entries()) {
      this.#fields[fieldName] = this.#controlledFieldFactory.createStateControlledDualFieldWithAsyncControlFn(this.#fields[fieldName] as DualField, controlFn, this.#fields);
    }
    for(const [fieldName, controlFn] of this.#asyncValueControlledDualFields.entries()) {
      this.#fields[fieldName] = this.#controlledFieldFactory.createValueControlledDualFieldWithAsyncControlFn(this.#fields[fieldName] as DualField, controlFn, this.#fields);
    }
    return this.#fields;
  }
}