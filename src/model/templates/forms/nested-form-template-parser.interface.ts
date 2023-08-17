import { NestedForm } from "../../forms/nested-form.interface";
import { NestedFormTemplate } from "./raw/nested-form-template.interface";

export interface NestedFormTemplateParser {
  parseTemplate(template : NestedFormTemplate) : NestedForm;
}

export const NestedFormTemplateParserKey = 'NestedFormTemplateParser';
export type NestedFormTemplateParserKeyType = typeof NestedFormTemplateParserKey;