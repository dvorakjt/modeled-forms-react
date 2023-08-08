import { AsyncDualStateControlFn } from "../../constituents/fields/async-dual-state-control-fn.type";
import { AsyncDualValueControlFn } from "../../constituents/fields/async-dual-value-control-fn.type";
import { AsyncFieldStateControlFn } from "../../constituents/fields/async-field-state-control-fn.type";
import { AsyncFieldValueControlFn } from "../../constituents/fields/async-field-value-control-fn.type";
import { SyncDualValueControlFn } from "../../constituents/fields/sync-dual-value-control-fn.type";
import { SyncFieldStateControlFn } from "../../constituents/fields/sync-field-state-control-fn.type";
import { SyncFieldValueControlFn } from "../../constituents/fields/sync-field-value-control-fn.type";
import { FormElementMap } from "../../constituents/form-elements/form-element-map.type";
import { NestedForm } from "../../constituents/forms/nested-form.interface";
import { ParsedDualFieldTemplate } from "./parsed-dual-field-template.interface";
import { ParsedFieldTemplate } from "./parsed-field-template.interface";

export interface FieldTemplateParser<Fields extends FormElementMap> {
  isNestedForm : boolean;
  isDualField : boolean;
  baseObject : NestedForm | ParsedFieldTemplate | ParsedDualFieldTemplate;
  syncValueControlFn? : SyncFieldValueControlFn<Fields> | SyncDualValueControlFn<Fields>;
  asyncValueControlFn? : AsyncFieldValueControlFn<Fields> | AsyncDualValueControlFn<Fields>;
  syncStateControlFn? : SyncFieldStateControlFn<Fields> | SyncDualValueControlFn<Fields>;
  asyncStateControlFn? : AsyncFieldStateControlFn<Fields> | AsyncDualStateControlFn<Fields>;
}