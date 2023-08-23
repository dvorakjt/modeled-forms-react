import { FormElementDictionary } from '../../form-elements/form-element-dictionary.type';
import { FirstNonValidFormElementTracker } from '../../trackers/first-nonvalid-form-element-tracker.interface';
import { FormElementTemplateDictionaryOrMap } from './form-element-template-dictionary-or-map.type';

interface FormElementTemplateDictionaryParser {
  parseTemplate(
    template: FormElementTemplateDictionaryOrMap,
  ): [FormElementDictionary, FirstNonValidFormElementTracker];
}
const FormElementTemplateDictionaryParserKey =
  'FormElementTemplateDictionaryParser';
type FormElementTemplateDictionaryParserKeyType =
  typeof FormElementTemplateDictionaryParserKey;

export {
  FormElementTemplateDictionaryParserKey,
  type FormElementTemplateDictionaryParser,
  type FormElementTemplateDictionaryParserKeyType,
};
