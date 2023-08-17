import { RootForm } from '../../forms/root-form.interface';
import { RootFormTemplate } from './raw/root-form-template.interface';

interface RootFormTemplateParser {
  parseTemplate(template: RootFormTemplate): RootForm;
}
const RootFormTemplateParserKey = 'RootFormTemplateParser';
type RootFormTemplateParserKeyType = typeof RootFormTemplateParserKey;

export {
  RootFormTemplateParserKey,
  type RootFormTemplateParser,
  type RootFormTemplateParserKeyType,
};
