import { AsyncStateControlledDualFieldTemplate } from "./async-state-controlled-dual-field-template.type";
import { AsyncStateControlledFieldTemplate } from "./async-state-controlled-field-template.type";
import { AsyncValueControlledDualFieldTemplate } from "./async-value-controlled-dual-field-template.type";
import { AsyncValueControlledFieldTemplate } from "./async-value-controlled-field-template.type";
import { DualFieldTemplate } from "./dual-field-template.interface";
import { FieldTemplate } from "./field-template.type";
import { SyncStateControlledDualFieldTemplate } from "./sync-state-controlled-dual-field-template.type";
import { SyncStateControlledFieldTemplate } from "./sync-state-controlled-field-template.type";
import { SyncValueControlledDualFieldTemplate } from "./sync-value-controlled-dual-field-template.type";
import { SyncValueControlledFieldTemplate } from "./sync-value-controlled-field-template.type";

export type FieldTemplateVariations<K extends string> = 
  string | 
  FieldTemplate |
  DualFieldTemplate |
  AsyncStateControlledFieldTemplate<K> | 
  AsyncStateControlledDualFieldTemplate<K> |
  AsyncValueControlledFieldTemplate<K> |
  AsyncValueControlledDualFieldTemplate<K> | 
  SyncStateControlledFieldTemplate<K> | 
  SyncStateControlledDualFieldTemplate<K> |
  SyncValueControlledFieldTemplate<K> |
  SyncValueControlledDualFieldTemplate<K>;