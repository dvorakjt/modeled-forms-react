import { StateControlledDualField } from "../../../constituents/fields/state-controlled-dual-field";
import { StateControlledField } from "../../../constituents/fields/state-controlled-field";
import { ValueControlledDualField } from "../../../constituents/fields/value-controlled-dual-field";
import { ValueControlledField } from "../../../constituents/fields/value-controlled-field";
import { FormElementMap } from "../form-elements/form-element-map.type";
import { DualField } from "./dual-field.interface";
import { DualStateControlFn } from "./dual-state-control-fn.type";
import { DualValueControlFn } from "./dual-value-control-fn.type";
import { Field } from "./field.interface";
import { SimpleStateControlFn } from "./simple-state-control-fn.type";
import { SimpleValueControlFn } from "./simple-value-control-fn.type";

export interface ControlledFieldFactory {
  createStateControlledField<Fields extends FormElementMap>(
    baseField : Field,
    stateControlFn : SimpleStateControlFn<Fields>
  ) : StateControlledField;
  createValueControlledField<Fields extends FormElementMap>(
    baseField : Field,
    valueControlFn : SimpleValueControlFn<Fields>
  ) : ValueControlledField;
  createStateControlledDualField<Fields extends FormElementMap>(
    baseField : DualField,
    stateControlFn : DualStateControlFn<Fields>
  ) : StateControlledDualField;
  createValueControlledDualField<Fields extends FormElementMap>(
    baseField : DualField,
    valueControlFn : DualValueControlFn<Fields>
  ) : ValueControlledDualField;
}