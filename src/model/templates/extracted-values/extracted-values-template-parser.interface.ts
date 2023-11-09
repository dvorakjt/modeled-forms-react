import { ExtractedValueDictionary } from '../../extracted-values/extracted-value-dictionary.type';
import { FormElementDictionary } from '../../form-elements/form-element-dictionary.type';
import { ExtractedValuesTemplate } from './extracted-values-template.interface';

interface ExtractedValuesTemplateParser {
  parseTemplate(
    template: ExtractedValuesTemplate,
    fields: FormElementDictionary,
  ): ExtractedValueDictionary;
}

const ExtractedValuesTemplateParserKey = 'ExtractedValuesTemplateParserKey';

type ExtractedValuesTemplateParserKeyType =
  typeof ExtractedValuesTemplateParserKey;

export {
  type ExtractedValuesTemplateParser,
  type ExtractedValuesTemplateParserKeyType,
  ExtractedValuesTemplateParserKey,
};
