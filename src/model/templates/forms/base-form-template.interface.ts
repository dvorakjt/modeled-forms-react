import { FinalizerTemplateDictionary } from '../finalizers/finalizer-template-dictionary.type';
import { FormElementTemplateDictionaryOrMap } from '../form-elements/form-element-template-dictionary-or-map.type';
import { MultiFieldValidatorsTemplate } from '../multi-field-validators/multi-field-validators-template.interface';

export interface BaseFormTemplate {
  fields: FormElementTemplateDictionaryOrMap;
  multiFieldValidators? : MultiFieldValidatorsTemplate;
  finalizerTemplateDictionary? : FinalizerTemplateDictionary;
}
