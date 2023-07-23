import { ManagedSubject } from "../../subscriptions/managed-subject";
import { Field } from "./field.interface";

export interface Form extends Field {
  hasSubmitted : boolean;
  submissionChanges : ManagedSubject<boolean>;
}