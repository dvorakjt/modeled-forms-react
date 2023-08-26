import { autowire } from "undecorated-di";
import { AutoTransformer, AutoTransformerKey } from "../../auto-transforms/auto-transformer.interface";
import { AbstractField } from "../base/abstract-field";
import { AutoTransformedField } from "./auto-transformed-field";
import { AutoTransformedFieldFactory, AutoTransformedFieldFactoryKey, AutoTransformedFieldFactoryKeyType } from "./auto-transformed-field-factory.interface";

class AutoTransformedFieldFactoryImpl implements AutoTransformedFieldFactory{
  #autoTransformer : AutoTransformer;

  constructor(autoTransformer : AutoTransformer) {
    this.#autoTransformer = autoTransformer;
  }
  
  createAutoTransformedField(baseField: AbstractField): AutoTransformedField {
    return new AutoTransformedField(baseField, this.#autoTransformer);
  }
}

const AutoTransformedFieldFactoryService = autowire<AutoTransformedFieldFactoryKeyType, AutoTransformedFieldFactory, AutoTransformedFieldFactoryImpl>(
  AutoTransformedFieldFactoryImpl,
  AutoTransformedFieldFactoryKey,
  [
    AutoTransformerKey
  ]
);

export { AutoTransformedFieldFactoryImpl, AutoTransformedFieldFactoryService };