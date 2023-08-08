import { DualStateControlFn } from "../../constituents/fields/dual-state-control-fn.type";
import { DualValueControlFn } from "../../constituents/fields/dual-value-control-fn.type";
import { SimpleStateControlFn } from "../../constituents/fields/simple-state-control-fn.type";
import { SimpleValueControlFn } from "../../constituents/fields/simple-value-control-fn.type";
import { FormElementMap } from "../../constituents/form-elements/form-element-map.type";
import { NestedForm } from "../../constituents/forms/nested-form.interface";
import { ParsedDualFieldTemplate } from "./parsed-dual-field-template.interface";
import { ParsedFieldTemplate } from "./parsed-field-template.interface";

export interface FieldTemplateParser<Fields extends FormElementMap> {
  isNestedForm : boolean;
  isDualField : boolean;
  baseObject : NestedForm | ParsedFieldTemplate | ParsedDualFieldTemplate;
  valueControlFn? : SimpleValueControlFn<Fields> | DualValueControlFn<Fields>;
  stateControlFn? : SimpleStateControlFn<Fields> | DualStateControlFn<Fields>;
}