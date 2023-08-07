import { CreateNestedFormFromTemplate } from "./create-nested-form-from-template.type";
import { CreateRootFormFromTemplate } from "./create-root-form-from-template.type";

export interface FormTemplateParser {
  createRootFormFromTemplate : CreateRootFormFromTemplate;
  createNestedFormFromTemplate : CreateNestedFormFromTemplate;
}