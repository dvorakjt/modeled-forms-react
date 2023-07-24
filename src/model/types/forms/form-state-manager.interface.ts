import { ResettableFormElement } from "../form-elements/resettable-form-element.interface";
import { StatefulFormElement } from "../form-elements/stateful-form-element.interface";

export interface FormStateManager extends StatefulFormElement<any>, ResettableFormElement {}