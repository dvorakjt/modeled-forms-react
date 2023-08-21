import { AbstractRootForm } from '../../forms/abstract-root-form';
import { RootFormTemplate } from './root-form-template.interface';

interface RootFormTemplateParser {
  parseTemplate(template: RootFormTemplate): AbstractRootForm;
}
const RootFormTemplateParserKey = 'RootFormTemplateParser';
type RootFormTemplateParserKeyType = typeof RootFormTemplateParserKey;

export {
  RootFormTemplateParserKey,
  type RootFormTemplateParser,
  type RootFormTemplateParserKeyType,
};
