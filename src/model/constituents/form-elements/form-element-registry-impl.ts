import { Field } from "../../types/constituents/fields/field.interface";
import { FormElementMap } from "../../types/constituents/form-elements/form-element-map.type";
import { FormElementRegistry } from "../../types/constituents/form-elements/form-element-registry.interface";
import { NestedForm } from "../../types/constituents/forms/nested-form.interface";

export class FormElementRegistryImpl implements FormElementRegistry {
  #formElementMap : FormElementMap = {}

  get formElementMap(): FormElementMap {
    return this.#formElementMap;
  }

  registerFormElement(fieldName : string, formElement: NestedForm | Field): void {
    this.#formElementMap[fieldName] = formElement;
  }
}