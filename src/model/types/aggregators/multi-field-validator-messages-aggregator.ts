import { Message } from "../state/messages/message.interface";
import { ManagedSubject } from "../subscriptions/managed-subject.interface";

export interface MultiFieldValidatorMessagesAggregator {
  messages : Array<Message>;
  messagesChanges : ManagedSubject<Array<Message>>;
}