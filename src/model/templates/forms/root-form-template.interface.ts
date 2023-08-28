import { SubmitFn } from '../../submission/submit-fn.type';
import { BaseFormTemplate } from './base-form-template.interface';

export interface RootFormTemplate extends BaseFormTemplate {
  submitFn: SubmitFn;
}
