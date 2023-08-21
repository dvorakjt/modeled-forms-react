import { MultiInputValidatorMessagesAggregator } from "../../aggregators/multi-input-validator-messages-aggregator.interface";
import { FormElementDictionary } from "../../form-elements/form-element-dictionary.type";
import { MultiFieldValidatorsTemplate } from "./multi-field-validators-template.interface";

interface MultiFieldValidatorsTemplateParser {
  parseTemplate(template : MultiFieldValidatorsTemplate, formElementDictionary : FormElementDictionary) : 
  [FormElementDictionary, FormElementDictionary, MultiInputValidatorMessagesAggregator];
}
const MultiFieldValidatorsTemplateParserKey = 'MultiFieldValidatorsTemplateParser'
type MultiFieldValidatorsTemplateParserKeyType = typeof MultiFieldValidatorsTemplateParserKey;

export { MultiFieldValidatorsTemplateParserKey, type MultiFieldValidatorsTemplateParser, type MultiFieldValidatorsTemplateParserKeyType };