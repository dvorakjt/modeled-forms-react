import { Field } from '../../constituents/fields/field.interface';
import { NestedForm } from '../../constituents/forms/nested-form.interface';

export type TemplateDerivedFormElementMap<K extends string> = {
  [P in K] : NestedForm | Field
}