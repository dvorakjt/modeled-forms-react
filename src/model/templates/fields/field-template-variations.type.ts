import { AsyncStateControlledDualFieldTemplate } from './controlled/async-state-controlled-dual-field-template.type';
import { AsyncStateControlledFieldTemplate } from './controlled/async-state-controlled-field-template.type';
import { AsyncValueControlledDualFieldTemplate } from './controlled/async-value-controlled-dual-field-template.type';
import { AsyncValueControlledFieldTemplate } from './controlled/async-value-controlled-field-template.type';
import { DualFieldTemplate } from './base/dual-field-template.interface';
import { FieldTemplate } from './base/field-template.type';
import { SyncStateControlledDualFieldTemplate } from './controlled/sync-state-controlled-dual-field-template.type';
import { SyncStateControlledFieldTemplate } from './controlled/sync-state-controlled-field-template.type';
import { SyncValueControlledDualFieldTemplate } from './controlled/sync-value-controlled-dual-field-template.type';
import { SyncValueControlledFieldTemplate } from './controlled/sync-value-controlled-field-template.type';

export type FieldTemplateVariations =
  | string
  | FieldTemplate
  | DualFieldTemplate
  | AsyncStateControlledFieldTemplate
  | AsyncStateControlledDualFieldTemplate
  | AsyncValueControlledFieldTemplate
  | AsyncValueControlledDualFieldTemplate
  | SyncStateControlledFieldTemplate
  | SyncStateControlledDualFieldTemplate
  | SyncValueControlledFieldTemplate
  | SyncValueControlledDualFieldTemplate;
