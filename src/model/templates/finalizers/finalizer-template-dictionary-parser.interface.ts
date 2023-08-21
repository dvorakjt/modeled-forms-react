import { FinalizerManager } from "../../finalizers/finalizer-manager.interface";
import { FormElementDictionary } from "../../form-elements/form-element-dictionary.type";
import { FinalizerTemplateDictionary } from "./finalizer-template-dictionary.type";

interface FinalizerTemplateDictionaryParser {
  parseTemplate(template : FinalizerTemplateDictionary, finalizerFacingFields : FormElementDictionary) : FinalizerManager;
}
const FinalizerTemplateDictionaryParserKey = 'FinalizerTemplateDictionaryParser';
type FinalizerTemplateDictionaryParserKeyType = typeof FinalizerTemplateDictionaryParserKey;

export { FinalizerTemplateDictionaryParserKey, type FinalizerTemplateDictionaryParser, FinalizerTemplateDictionaryParserKeyType};