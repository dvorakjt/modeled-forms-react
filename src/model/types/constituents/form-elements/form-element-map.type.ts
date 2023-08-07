import type { Field } from '../fields/field.interface';
import type { NestedForm } from '../forms/nested-form.interface';

export type FormElementMap = {
  [key: string]: NestedForm | Field;
};
