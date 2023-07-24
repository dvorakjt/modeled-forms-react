import { OmittableFormElement } from "../form-elements/omittable-form-element.interface";
import { ResettableFormElement } from "../form-elements/resettable-form-element.interface";
import { StatefulFormElement } from "../form-elements/stateful-form-element.interface";

export interface NestedForm extends StatefulFormElement<any>, OmittableFormElement, ResettableFormElement {}