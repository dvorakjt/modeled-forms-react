import { AbstractField } from '../fields/base/abstract-field';
import type { NestedForm } from '../forms/nested-form.interface';

export type FormElementMap = {
  [key: string]: NestedForm | AbstractField;
};
