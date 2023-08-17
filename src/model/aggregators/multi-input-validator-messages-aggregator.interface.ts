import type { Subject } from "rxjs";
import type { Message } from "../state/messages/message.interface";

export interface MultiInputValidatorMessagesAggregator {
  messages : Array<Message>;
  messagesChanges : Subject<Array<Message>>;
}