import { AbstractNestedForm } from '../../forms/abstract-nested-form';
import { NestedFormTemplate } from './nested-form-template.interface';

interface NestedFormTemplateParser {
  parseTemplate(template: NestedFormTemplate): AbstractNestedForm;
}
const NestedFormTemplateParserKey = 'NestedFormTemplateParser';
type NestedFormTemplateParserKeyType = typeof NestedFormTemplateParserKey;

export {
  NestedFormTemplateParserKey,
  type NestedFormTemplateParser,
  type NestedFormTemplateParserKeyType,
};
