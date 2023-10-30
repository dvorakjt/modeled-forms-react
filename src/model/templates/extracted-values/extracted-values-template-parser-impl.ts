import { autowire } from "undecorated-di";
import { AdapterFactoryKey, type AdapterFactory } from "../../adapters/adapter-factory.interface";
import { ExtractedValueDictionary } from "../../extracted-values/extracted-value-dictionary.type";
import { FormElementDictionary } from "../../form-elements/form-element-dictionary.type";
import { ExtractedValuesTemplateParser, ExtractedValuesTemplateParserKey, ExtractedValuesTemplateParserKeyType } from "./extracted-values-template-parser.interface";
import { ExtractedValuesTemplate } from "./extracted-values-template.interface";

class ExtractedValuesTemplateParserImpl implements ExtractedValuesTemplateParser {
  _adapterFactory : AdapterFactory;

  constructor(adapterFactory : AdapterFactory) {
    this._adapterFactory = adapterFactory;
  }

  parseTemplate(template: ExtractedValuesTemplate, fields : FormElementDictionary): ExtractedValueDictionary {
    const extractedValuesDictionary : ExtractedValueDictionary = {};
    if(template.syncExtractedValues) {
      for(const key in template.syncExtractedValues) {
        extractedValuesDictionary[key] = this._adapterFactory.createSyncAdapterFromFnWithFields(template.syncExtractedValues[key], fields);
      }
    }
    if(template.asyncExtractedValues) {
      for(const key in template.asyncExtractedValues) {
        extractedValuesDictionary[key] = this._adapterFactory.createAsyncAdapterFromFnWithFields(template.asyncExtractedValues[key], fields);
      }
    }
    return extractedValuesDictionary;
  }
}

const ExtractedValuesTemplateParserService = autowire<ExtractedValuesTemplateParserKeyType, ExtractedValuesTemplateParser, ExtractedValuesTemplateParserImpl>(
  ExtractedValuesTemplateParserImpl,
  ExtractedValuesTemplateParserKey,
  [
    AdapterFactoryKey
  ]
);

export { ExtractedValuesTemplateParser, ExtractedValuesTemplateParserService };