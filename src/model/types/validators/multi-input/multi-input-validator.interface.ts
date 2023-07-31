import { Message } from "../../state/messages/message.interface";
import { Validity } from "../../state/validity.enum";
import { ManagedSubject } from "../../subscriptions/managed-subject.interface";
import { OneTimeValueEmitter } from "../../subscriptions/one-time-value-emitter.interface";

export interface MultiInputValidator {
  calculatedValidityChanges : ManagedSubject<Validity>;
  overallValidityChanges : ManagedSubject<Validity>;
  messageChanges : ManagedSubject<Message>;
  accessedFields : OneTimeValueEmitter<Set<string>>;
}