import { AsyncStateControlledDualFieldTemplate } from './async-state-controlled-dual-field-template.type';
import { AsyncStateControlledFieldTemplate } from './async-state-controlled-field-template.type';
import { AsyncValueControlledDualFieldTemplate } from './async-value-controlled-dual-field-template.type';
import { AsyncValueControlledFieldTemplate } from './async-value-controlled-field-template.type';
import { SyncStateControlledDualFieldTemplate } from './sync-state-controlled-dual-field-template.type';
import { SyncStateControlledFieldTemplate } from './sync-state-controlled-field-template.type';
import { SyncValueControlledDualFieldTemplate } from './sync-value-controlled-dual-field-template.type';
import { SyncValueControlledFieldTemplate } from './sync-value-controlled-field-template.type';

export type ControlledFieldTemplateVariations =
  | AsyncStateControlledFieldTemplate
  | AsyncStateControlledDualFieldTemplate
  | AsyncValueControlledFieldTemplate
  | AsyncValueControlledDualFieldTemplate
  | SyncStateControlledFieldTemplate
  | SyncStateControlledDualFieldTemplate
  | SyncValueControlledFieldTemplate
  | SyncValueControlledDualFieldTemplate;
