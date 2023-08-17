import { NestedForm } from '../../forms/nested-form.interface';
import { NestedFormTemplate } from './raw/nested-form-template.interface';

interface NestedFormTemplateParser {
  parseTemplate(template: NestedFormTemplate): NestedForm;
}
const NestedFormTemplateParserKey = 'NestedFormTemplateParser';
type NestedFormTemplateParserKeyType = typeof NestedFormTemplateParserKey;

export {
  NestedFormTemplateParserKey,
  type NestedFormTemplateParser,
  type NestedFormTemplateParserKeyType,
};
