import { BaseFieldTemplate } from './base-field-template.type';

export interface DualFieldTemplate extends BaseFieldTemplate {
  defaultValue?: undefined;
  primaryDefaultValue: string;
  secondaryDefaultValue: string;
}
