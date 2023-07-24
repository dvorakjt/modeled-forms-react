import { ManagedSubject } from "../../subscriptions/managed-subject";
import { ResettableFormElement } from "../form-elements/resettable-form-element.interface";
import type { StatefulFormElement } from "../form-elements/stateful-form-element.interface";

export interface RootForm extends StatefulFormElement<any>, ResettableFormElement {
  hasSubmitted : boolean;
  submissionChanges: ManagedSubject<boolean>;
  submit : () => Promise<any>;
  unsubscribeAll : () => void;
}