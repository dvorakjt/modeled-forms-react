import { DualFieldTemplate } from "./dual-field-template.interface";
import { FieldTemplate } from "./field-template.type";
import { StateControlledDualFieldTemplate } from "./state-controlled-dual-field-template.type";
import { StateControlledFieldTemplate } from "./state-controlled-field-template.type";
import { ValueControlledDualFieldTemplate } from "./value-controlled-dual-field-template.type";
import { ValueControlledFieldTemplate } from "./value-controlled-field-template.type";

export type FieldTemplateVariations<K extends string> = 
  string | 
  FieldTemplate |
  DualFieldTemplate |
  StateControlledFieldTemplate<K> | 
  StateControlledDualFieldTemplate<K> |
  ValueControlledFieldTemplate<K> |
  ValueControlledDualFieldTemplate<K>;