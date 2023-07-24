import type { OmittableFormElement } from "../form-elements/omittable-form-element.interface";
import type { StatefulFormElement } from "../form-elements/stateful-form-element.interface";
import type { DualFieldState } from "../state/dual-field-state.interface";
import type { ResettableFormElement } from "../form-elements/resettable-form-element.interface";
import type { FieldState } from "../state/field-state.interface";

export interface Field extends StatefulFormElement<string>, OmittableFormElement, ResettableFormElement {
  setState(state : FieldState | DualFieldState) : void;
  setValue(value : any) : void;
}