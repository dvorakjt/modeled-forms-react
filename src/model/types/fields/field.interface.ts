import type { OmittableFormElement } from "../form-elements/omittable-form-element.interface";
import type { StatefulFormElement } from "../form-elements/stateful-form-element.interface";
import type { DualFieldSetStateArg } from "../state/dual-field-set-state-arg.interface";
import type { ResettableFormElement } from "../form-elements/resettable-form-element.interface";
import type { FieldState } from "../state/field-state.interface";
import { DualFieldSetValueArg } from "../state/dual-field-set-value-arg.interface";

export interface Field extends StatefulFormElement<string>, OmittableFormElement, ResettableFormElement {
  setState(state : FieldState | DualFieldSetStateArg ) : void;
  setValue(value : string | DualFieldSetValueArg) : void;
}