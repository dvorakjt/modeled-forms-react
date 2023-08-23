import { AbstractField } from '../fields/base/abstract-field';
import type { AbstractNestedForm } from '../forms/abstract-nested-form';

export type FormElementDictionary = {
  [key: string]: AbstractNestedForm | AbstractField;
};
