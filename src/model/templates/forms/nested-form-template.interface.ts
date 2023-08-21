import { BaseFormTemplate } from './base-form-template.interface';

export interface NestedFormTemplate extends BaseFormTemplate {
  omitByDefault? : boolean;
}
