import { RootForm } from "../../forms/root-form.interface";
import { RootFormTemplate } from "./raw/root-form-template.interface";

export interface RootFormTemplateParser {
  parseTemplate(template : RootFormTemplate) : RootForm;
}

export const RootFormTemplateParserKey = 'RootFormTemplateParser';
export type RootFormTemplateParserKeyType = typeof RootFormTemplateParserKey;